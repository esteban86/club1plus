// D1 falso, mínimo, en memoria — cubre solo los patrones de consulta que usa
// app/src/lib/auth.ts (SELECT ... WHERE col = ?, INSERT INTO ... VALUES,
// UPDATE ... SET col = ? WHERE id = ?, DELETE FROM ... WHERE id = ?).
// No es un motor SQL real: alcanza para testear la lógica de auth sin D1 real.

type Row = Record<string, unknown>;

export class FakeD1 {
  tables: Record<string, Row[]> = {
    members: [],
    admin_users: [],
    magic_links: [],
    sessions: [],
  };

  prepare(sql: string) {
    return new FakeStatement(this, sql);
  }
}

class FakeStatement {
  private params: unknown[] = [];
  constructor(
    private readonly db: FakeD1,
    private readonly sql: string,
  ) {}

  bind(...params: unknown[]) {
    this.params = params;
    return this;
  }

  async first<T = Row>(): Promise<T | null> {
    const rows = this.run_select();
    return (rows[0] as T) ?? null;
  }

  async all<T = Row>(): Promise<{ results: T[] }> {
    return { results: this.run_select() as T[] };
  }

  async run(): Promise<{ success: boolean }> {
    const sql = this.sql.trim();
    if (sql.startsWith("INSERT INTO")) {
      const table = sql.match(/INSERT INTO (\w+)/)?.[1];
      const cols = sql.match(/\(([^)]+)\)\s+VALUES/)?.[1].split(",").map((c) => c.trim());
      if (!table || !cols) throw new Error(`FakeD1: no pude parsear INSERT: ${sql}`);
      const row: Row = {};
      cols.forEach((c, i) => (row[c] = this.params[i]));
      // Como en SQLite real: cualquier columna no listada en el INSERT es NULL,
      // no "undefined" (que rompería comparaciones tipo `campo !== null`).
      const withNullDefaults = new Proxy(row, {
        get: (target, prop: string) => (prop in target ? target[prop] : null),
      });
      this.db.tables[table].push(withNullDefaults as Row);
      return { success: true };
    }
    if (sql.startsWith("UPDATE")) {
      const table = sql.match(/UPDATE (\w+)/)?.[1];
      const setCol = sql.match(/SET (\w+)/)?.[1];
      if (!table || !setCol) throw new Error(`FakeD1: no pude parsear UPDATE: ${sql}`);
      const [setValue, whereValue] = this.params;
      const row = this.db.tables[table].find((r) => r.id === whereValue);
      if (row) row[setCol] = setValue;
      return { success: true };
    }
    if (sql.startsWith("DELETE FROM")) {
      const table = sql.match(/DELETE FROM (\w+)/)?.[1];
      if (!table) throw new Error(`FakeD1: no pude parsear DELETE: ${sql}`);
      const [whereValue] = this.params;
      this.db.tables[table] = this.db.tables[table].filter((r) => r.id !== whereValue);
      return { success: true };
    }
    throw new Error(`FakeD1: no soporta este SQL: ${sql}`);
  }

  private run_select(): Row[] {
    const table = this.sql.match(/FROM (\w+)/)?.[1];
    const whereCol = this.sql.match(/WHERE (\w+)\s*=/)?.[1];
    if (!table) throw new Error(`FakeD1: no pude parsear SELECT: ${this.sql}`);
    const rows = this.db.tables[table] ?? [];
    if (!whereCol) return rows;
    const [whereValue] = this.params;
    return rows.filter((r) => r[whereCol] === whereValue);
  }
}
