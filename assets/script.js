// ==========================================
// DADOS INICIAIS
// ==========================================

const usersSeed = [
    { id: 1, name: "Ana Costa", email: "ana@email.com", password: "••••••••", administrator: true },
    { id: 2, name: "Lucas Mendes", email: "lucas@email.com", password: "••••••••", administrator: false },
    { id: 3, name: "Maria Silva", email: "maria@email.com", password: "••••••••", administrator: false },
    { id: 4, name: "João Pedro", email: "joao@email.com", password: "••••••••", administrator: false }
];

const ordersSeed = [
    { id: 101, user_id: 1, product: "Notebook", total: 4500 },
    { id: 102, user_id: 2, product: "Mouse", total: 150 },
    { id: 103, user_id: 1, product: "Teclado", total: 320 },
    { id: 104, user_id: 3, product: "Monitor", total: 1200 }
];

// As tabelas começam vazias e não existem até CREATE TABLE.
let users = [];
let orders = [];

let createdUsers = false;
let createdOrders = false;


// ==========================================
// COMANDOS SQL
// ==========================================

const commands = [
    {
        id: "create",
        name: "CREATE TABLE (users)",
        description: "Cria a tabela de usuários",

        sql: `CREATE TABLE users (
  id INT,
  name TEXT,
  email TEXT,
  password TEXT,
  administrator BOOLEAN
);`,

        run() {
            if (createdUsers) {
                return {
                    message: "Table Already Exists",
                    detail: "Table users already exists.",
                    rows: 0
                };
            }

            createdUsers = true;
            users = [];

            return {
                message: "Table Created",
                detail: "Query executed successfully.\nTable users created.\n0 rows inserted.",
                rows: 0
            };
        }
    },

    // INSERT  USERS

    {
        id: "insertUsers",
        name: "INSERT (users)",
        description: "Insere users",

        sql: `INSERT INTO users (
  id, name, email, password, administrator
) VALUES
  (1, 'Ana Costa', 'ana@email.com', '••••••••', true),
  (2, 'Lucas Mendes', 'lucas@email.com', '••••••••', false),
  (3, 'Maria Silva', 'maria@email.com', '••••••••', false),
  (4, 'João Pedro', 'joao@email.com', '••••••••', false);`,

        run() {
            if (!createdUsers) {
                return {
                    message: "Table Not Found",
                    detail: "Execute CREATE TABLE users before inserting data.",
                    rows: 0
                };
            }

            // Evita inserir os mesmos usuários novamente.
            if (users.length > 0) {
                return {
                    message: "Users Already Exist",
                    detail: "The users table already contains records.",
                    rows: 0,
                    preview: "users",
                    data: users
                };
            }

            // Simula o cadastro dos quatro usuários.
            users = structuredClone(usersSeed);

            return {
                message: "Users Registered",
                detail: "4 users successfully inserted into the users table.",
                rows: users.length,
                preview: "users",
                data: users
            };
        }
    },

    // SELECT

    {
        id: "select",
        name: "SELECT (users)",
        description: "Lê linhas da tabela users",

        sql: `SELECT id, name, email, password, administrator
FROM users;`,

        run() {
            if (!createdUsers) {
                return {
                    message: "Table Not Found",
                    detail: "The users table does not exist.",
                    rows: 0,
                    preview: "users",
                    data: []
                };
            }

            return {
                message: "Query Executed",
                detail: "Records retrieved from users.",
                rows: users.length,
                preview: "users",
                data: users
            };
        }
    },

    // WHERE

    {
        id: "where",
        name: "WHERE",
        description: "Filtra linhas da tabela users",

        sql: `SELECT id, name, email, password, administrator
FROM users
WHERE administrator = TRUE;`,

        run() {
            if (!createdUsers) {
                return {
                    message: "Table Not Found",
                    detail: "The users table does not exist.",
                    rows: 0,
                    preview: "filteredUsers",
                    data: []
                };
            }

            const data = users.filter(user => user.administrator);

            return {
                message: "Filter Applied",
                detail: "Showing administrators only.",
                rows: data.length,
                preview: "filteredUsers",
                data
            };
        }
    },

    // ORDER BY

    {
        id: "orderby",
        name: "ORDER BY",
        description: "Organiza linhas da tabela users",

        sql: `SELECT id, name, email, password, administrator
FROM users
ORDER BY name ASC;`,

        run() {

            if (!createdUsers) {
                return {
                    message: "Table Not Found",
                    detail: "The users table does not exist.",
                    rows: 0,
                    preview: "sortedUsers",
                    data: []
                };
            }

            const data = createdUsers
                ? [...users].sort((a, b) =>
                    a.name.localeCompare(b.name)
                )
                : [];

            return {
                message: "Results Sorted",
                detail: "Records ordered by name, ascending.",
                rows: data.length,
                preview: "sortedUsers",
                data
            };
        }
    },

    // CREATE TABLE orders

    {
        id: "createOrders",
        name: "CREATE TABLE (orders)",
        description: "Cria tabela de pedidos",

        sql: `CREATE TABLE orders (
  id INT,
  user_id INT,
  product TEXT,
  total INT
);`,

        run() {
            if (createdOrders) {
                return {
                    message: "Table Already Exists",
                    detail: "Table orders already exists.",
                    rows: 0
                };
            }

            createdOrders = true;
            orders = [];

            return {
                message: "Table Created",
                detail: "Query executed successfully.\nTable orders created.\n0 rows inserted.",
                rows: 0
            };
        }
    },

    // INSERT ORDERS

    {
        id: "insertOrders",
        name: "INSERT (orders)",
        description: "Insere pedidos",

        sql: `INSERT INTO orders (
  id, user_id, product, total
) VALUES
  (101, 1, 'Notebook', 4500),
  (102, 2, 'Mouse', 150),
  (103, 1, 'Teclado', 320),
  (104, 3, 'Monitor', 1200);`,

        run() {
            if (!createdOrders) {
                return {
                    message: "Table Not Found",
                    detail: "Execute CREATE TABLE orders before inserting data.",
                    rows: 0
                };
            }

            if (orders.length > 0) {
                return {
                    message: "Orders Already Exist",
                    detail: "The orders table already contains records.",
                    rows: 0,
                    preview: "orders",
                    data: orders
                };
            }

            orders = structuredClone(ordersSeed);

            return {
                message: "Orders Registered",
                detail: "4 orders successfully inserted into the orders table.",
                rows: orders.length,
                preview: "orders",
                data: orders
            };
        }
    },

    {
        id: "groupby",
        name: "GROUP BY",
        description: "Agrupa linhas da tabela orders",

        sql: `SELECT user_id, COUNT(*) AS total
FROM orders
GROUP BY user_id;`,

        run() {
            if (!createdOrders) {
                return {
                    message: "Table Not Found",
                    detail: "The orders table does not exist.",
                    rows: 0,
                    preview: "groups",
                    data: []
                };
            }

            const groups = {};

            orders.forEach(order => {
                groups[order.user_id] =
                    (groups[order.user_id] || 0) + 1;
            });

            const data = Object.entries(groups).map(
                ([user_id, total]) => ({
                    user_id: Number(user_id),
                    total
                })
            );

            return {
                message: "Groups Created",
                detail: "Orders grouped by user_id.",
                rows: data.length,
                preview: "groups",
                data
            };
        }
    },

    {
        id: "join",
        name: "JOIN",
        description: "Combina tabelas",

        sql: `SELECT users.name, orders.product,
       orders.total
FROM users
JOIN orders
  ON users.id = orders.user_id;`,

        run() {
            if (!createdUsers || !createdOrders) {
                return {
                    message: "Table Not Found",
                    detail: "Both users and orders must exist.",
                    rows: 0,
                    preview: "joined",
                    data: []
                };
            }

            const data = orders
                .map(order => {
                    const user = users.find(
                        item => item.id === order.user_id
                    );

                    return user
                        ? {
                            name: user.name,
                            product: order.product,
                            total: order.total
                        }
                        : null;
                })
                .filter(Boolean);

            return {
                message: "Tables Joined",
                detail: "Matching users and orders.",
                rows: data.length,
                preview: "joined",
                data
            };
        }
    },

    {
        id: "update",
        name: "UPDATE",
        description: "Atualiza informações",

        sql: `UPDATE users
SET administrator = TRUE
WHERE id = 2;`,

        run() {
            if (!createdUsers) {
                return {
                    message: "Table Not Found",
                    detail: "The users table does not exist.",
                    rows: 0
                };
            }

            const index = users.findIndex(
                user => user.id === 2
            );

            if (index === -1) {
                return {
                    message: "No Rows Updated",
                    detail: "No user found with id 2.",
                    rows: 0
                };
            }

            users[index] = {
                ...users[index],
                administrator: true
            };

            return {
                message: "Record Updated",
                detail: "Updated administrator for user id 2.",
                rows: 1
            };
        }
    },

    {
        id: "delete",
        name: "DELETE",
        description: "Apaga linhas",

        sql: `DELETE FROM users
WHERE id = 4;`,

        run() {
            if (!createdUsers) {
                return {
                    message: "Table Not Found",
                    detail: "The users table does not exist.",
                    rows: 0
                };
            }

            const before = users.length;

            users = users.filter(user => user.id !== 4);

            const deleted = before - users.length;

            return {
                message: deleted
                    ? "Record Deleted"
                    : "No Rows Deleted",
                detail: deleted
                    ? "Removed user with id 4."
                    : "No user found with id 4.",
                rows: deleted
            };
        }
    },

    {
        id: "drop",
        name: "DROP TABLE",
        description: "Apaga tabela",

        sql: `DROP TABLE users;`,

        run() {
            if (!createdUsers) {
                return {
                    message: "Table Not Found",
                    detail: "The users table does not exist.",
                    rows: 0
                };
            }

            createdUsers = false;
            users = [];

            return {
                message: "Table Dropped",
                detail: "Table users no longer exists.",
                rows: 0
            };
        }
    }
];


// ==========================================
// CARDS
// ==========================================

const cardList = document.getElementById("cardList");

commands.forEach((command, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "sql-card";
    button.dataset.id = command.id;
    button.setAttribute("aria-pressed", "false");

    button.innerHTML = `
        <span class="card-number">
            ${String(index + 1).padStart(2, "0")}
        </span>
        <span>
            <span class="card-name">${command.name}</span>
            <span class="card-description">
                ${command.description}
            </span>
        </span>
        <span class="card-arrow">↗</span>
    `;

    button.addEventListener("click", () => {
        selectCommand(command.id);
    });

    cardList.appendChild(button);
});


// ==========================================
// UTILITÁRIOS
// ==========================================

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// DESTAQUE DE SINTAXE SQL
// ==========================================

function highlightSQL(line) {
    if (line.trim().startsWith("--")) {
        return `<span class="comment">${escapeHTML(line)}</span>`;
    }

    const pattern =
        /('[^']*'|\b(?:CREATE|TABLE|INSERT|INTO|VALUES|SELECT|FROM|WHERE|ORDER|BY|ASC|DESC|GROUP|JOIN|ON|UPDATE|SET|DELETE|DROP|AND|OR|AS|COUNT|TRUE|FALSE|NULL|INT|INTEGER|TEXT|BOOLEAN|VARCHAR|PRIMARY|KEY|NOT|DISTINCT|LIMIT)\b|\b\d+\b|[=<>]+)/gi;

    let result = "";
    let last = 0;
    let match;

    while ((match = pattern.exec(line)) !== null) {
        result += escapeHTML(line.slice(last, match.index));

        const token = match[0];
        let cls = "kw";

        if (token.startsWith("'")) {
            cls = "str";
        } else if (/^\d+$/.test(token)) {
            cls = "num";
        } else if (/^[=<>]+$/.test(token)) {
            cls = "operator";
        } else if (
            /^(INT|INTEGER|TEXT|BOOLEAN|VARCHAR)$/i.test(token)
        ) {
            cls = "type";
        }

        result += `<span class="${cls}">${escapeHTML(token)}</span>`;
        last = pattern.lastIndex;
    }

    return result + escapeHTML(line.slice(last));
}


// ==========================================
// EDITOR DE CÓDIGO
// ==========================================

function renderCode(sql) {
    const lines = sql.split("\n");

    document.getElementById("queryCode").innerHTML =
        lines.map((line, index) => `
            <div class="code-line">
                <span class="line-number">${index + 1}</span>
                <span class="code-text">
                    ${highlightSQL(line) || "&nbsp;"}
                </span>
            </div>
        `).join("");

    document.getElementById("queryLines").textContent =
        `${lines.length} LINES`;
}


// ==========================================
// RENDERIZAÇÃO DAS TABELAS
// ==========================================

function renderTable(containerId, columns, data) {
    const container = document.getElementById(containerId);

    if (!data || data.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div>NO DATA AVAILABLE</div>
                <div>Execute a query to inspect records.</div>
            </div>
        `;
        return;
    }

    const head = columns
        .map(column => `<th>${escapeHTML(column.label)}</th>`)
        .join("");

    const body = data.map(row => `
        <tr>
            ${columns.map(column => {
        let value = row[column.key];

        if (typeof value === "boolean") {
            value = String(value).toUpperCase();
        }

        return `<td>${escapeHTML(value ?? "NULL")}</td>`;
    }).join("")}
        </tr>
    `).join("");

    container.innerHTML = `
        <table>
            <thead><tr>${head}</tr></thead>
            <tbody>${body}</tbody>
        </table>
    `;
}

const userColumns = [
    { key: "id", label: "id" },
    { key: "name", label: "name" },
    { key: "email", label: "email" },
    { key: "password", label: "password" },
    { key: "administrator", label: "admin" }
];

const orderColumns = [
    { key: "id", label: "id" },
    { key: "user_id", label: "user_id" },
    { key: "product", label: "product" },
    { key: "total", label: "total" }
];

function renderUsers(data = users, exists = createdUsers) {
    document.getElementById("usersCount").textContent =
        exists ? `${data.length} ROWS` : "NOT FOUND";

    document.getElementById("usersFooter").textContent =
        exists ? "SCHEMA / USERS" : "TABLE / NOT CREATED";

    renderTable(
        "usersTable",
        userColumns,
        exists ? data : []
    );
}

function renderOrders(data = orders, exists = createdOrders) {
    document.getElementById("ordersCount").textContent =
        exists ? `${data.length} ROWS` : "NOT FOUND";

    document.getElementById("ordersFooter").textContent =
        exists ? "SCHEMA / ORDERS" : "TABLE / NOT CREATED";

    renderTable(
        "ordersTable",
        orderColumns,
        exists ? data : []
    );
}


// ==========================================
// PAINEL RESULT
// ==========================================

function renderResult(result) {

    const isError =
        result.message === "Table Not Found" ||
        result.message === "Table Already Exists" ||
        result.message === "Users Already Exist" ||
        result.message === "No Rows Updated" ||
        result.message === "No Rows Deleted";

    document.getElementById("resultMessage").textContent =
        result.message;

    document.getElementById("resultDetail").innerHTML =
        escapeHTML(result.detail).replace(/\n/g, "<br>");

    document.getElementById("resultStatus").textContent =
        isError ? "STATUS: FAIL" : "STATUS: PASS";

    document.getElementById("resultRows").textContent =
        `${result.rows} ${result.rows === 1 ? "ROW" : "ROWS"}`;

    document.getElementById("resultPass").textContent =
        isError ? "● ERROR" : "● SUCCESS";

    document.getElementById("resultIcon").textContent =
        isError ? "!" : "✓";
}


// ==========================================
// EXECUÇÃO DOS COMANDOS
// ==========================================

function selectCommand(id) {
    const command = commands.find(item => item.id === id);
    if (!command) return;

    document.querySelectorAll(".sql-card").forEach(card => {
        const active = card.dataset.id === id;

        card.classList.toggle("active", active);
        card.setAttribute("aria-pressed", String(active));
    });

    renderCode(command.sql);

    const result = command.run();

    // Painel users: mostra os dados cadastrados
    if (
        result.preview === "filteredUsers" ||
        result.preview === "sortedUsers"
    ) {
        renderUsers(result.data, createdUsers);
    } else {
        renderUsers(users, createdUsers);
    }

    // Painel orders: mostra os pedidos existentes
    if (result.preview === "groups") {
        renderTable(
            "ordersTable",
            [
                { key: "user_id", label: "user_id" },
                { key: "total", label: "total" }
            ],
            result.data
        );

        document.getElementById("ordersCount").textContent =
            `${result.data.length} GROUPS`;

        document.getElementById("ordersFooter").textContent =
            "QUERY / GROUP BY";

    } else if (result.preview === "joined") {
        renderTable(
            "ordersTable",
            [
                { key: "name", label: "name" },
                { key: "product", label: "product" },
                { key: "total", label: "total" }
            ],
            result.data
        );

        document.getElementById("ordersCount").textContent =
            `${result.data.length} ROWS`;

        document.getElementById("ordersFooter").textContent =
            "QUERY / JOIN";

    } else {
        renderOrders();
    }

    // Atualiza o painel Result
    renderResult(result);
}


// ==========================================
// ESTADO INICIAL
// ==========================================

// Ambas as tabelas começam vazias.
// CREATE TABLE não insere nenhum registro.
renderCode(commands[0].sql);
renderUsers([], false);
renderOrders([], false);

document.getElementById("resultMessage").textContent =
    "Ready to Execute";

document.getElementById("resultStatus").textContent =
    "STATUS: READY";

document.getElementById("resultDetail").textContent =
    "Select a SQL command to begin.";

document.getElementById("resultRows").textContent = "0 ROWS";
document.getElementById("resultPass").textContent = "● WAITING";

// Deixa CREATE TABLE selecionado, sem executar o comando.
document.querySelector('[data-id="create"]').classList.add("active");
document.querySelector('[data-id="create"]').setAttribute("aria-pressed", "true");