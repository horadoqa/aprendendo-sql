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

// Padroniza o formato de todos os resultados.
function makeResult(success, message, detail, rows = 0, extra = {}) {
    return {
        success,
        message,
        detail,
        rows,
        ...extra
    };
}

// Verifica as restrições da tabela users.
function validateUsers(data) {
    const ids = new Set();
    const emails = new Set();

    for (const user of data) {
        if (
            user.id == null ||
            !user.name?.trim() ||
            !user.email?.trim() ||
            !user.password
        ) {
            return "All required user fields must be filled.";
        }

        if (ids.has(user.id)) {
            return `Duplicate user id: ${user.id}.`;
        }

        if (emails.has(user.email.toLowerCase())) {
            return `Duplicate email: ${user.email}.`;
        }

        ids.add(user.id);
        emails.add(user.email.toLowerCase());
    }

    return null;
}

// Verifica as restrições da tabela orders.
function validateOrders(data) {
    const ids = new Set();

    for (const order of data) {
        if (
            order.id == null ||
            order.user_id == null ||
            !order.product?.trim() ||
            !Number.isFinite(order.total) ||
            order.total < 0
        ) {
            return "All required order fields must be valid.";
        }

        if (ids.has(order.id)) {
            return `Duplicate order id: ${order.id}.`;
        }

        if (!users.some(user => user.id === order.user_id)) {
            return `Foreign key violation: user ${order.user_id} does not exist.`;
        }

        ids.add(order.id);
    }

    return null;
}


// ==========================================
// COMANDOS SQL
// ==========================================

const commands = [
    {
        id: "create",
        name: "CREATE TABLE (users)",
        description: "Cria a tabela de usuários",

        sql: `CREATE TABLE users (
  id INT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  administrator BOOLEAN NOT NULL DEFAULT FALSE
);`,

        run() {
            if (createdUsers) {
                return makeResult(
                    false,
                    "Table Already Exists",
                    "Table users already exists."
                );
            }

            createdUsers = true;
            users = [];

            return makeResult(
                true,
                "Table Created",
                "Table users created successfully.\n0 rows inserted."
            );
        }
    },

    {
        id: "insertUsers",
        name: "INSERT (users)",
        description: "Insere usuários",

        sql: `INSERT INTO users (
  id, name, email, password, administrator
) VALUES
  (1, 'Ana Costa', 'ana@email.com', '••••••••', TRUE),
  (2, 'Lucas Mendes', 'lucas@email.com', '••••••••', FALSE),
  (3, 'Maria Silva', 'maria@email.com', '••••••••', FALSE),
  (4, 'João Pedro', 'joao@email.com', '••••••••', FALSE);`,

        run() {
            if (!createdUsers) {
                return makeResult(
                    false,
                    "Table Not Found",
                    "Execute CREATE TABLE users before inserting data."
                );
            }

            if (users.length > 0) {
                return makeResult(
                    false,
                    "Users Already Exist",
                    "The users table already contains records.",
                    0,
                    { preview: "users", data: users }
                );
            }

            const validationError = validateUsers(usersSeed);

            if (validationError) {
                return makeResult(
                    false,
                    "Constraint Violation",
                    validationError,
                    0,
                    { preview: "users", data: users }
                );
            }

            users = structuredClone(usersSeed);

            return makeResult(
                true,
                "Users Registered",
                `${users.length} users successfully inserted.`,
                users.length,
                { preview: "users", data: users }
            );
        }
    },

    {
        id: "select",
        name: "SELECT (users)",
        description: "Consulta usuários",

        sql: `SELECT id, name, email, administrator
FROM users;`,

        run() {
            if (!createdUsers) {
                return makeResult(
                    false,
                    "Table Not Found",
                    "The users table does not exist.",
                    0,
                    { preview: "users", data: [] }
                );
            }

            const data = users.map(
                ({ id, name, email, administrator }) => ({
                    id, name, email, administrator
                })
            );

            return makeResult(
                true,
                "Query Executed",
                "Records retrieved from users.",
                data.length,
                { preview: "users", data }
            );
        }
    },

    {
        id: "where",
        name: "WHERE",
        description: "Filtra usuários",

        sql: `SELECT id, name, email, administrator
FROM users
WHERE administrator = TRUE;`,

        run() {
            if (!createdUsers) {
                return makeResult(
                    false,
                    "Table Not Found",
                    "The users table does not exist.",
                    0,
                    { preview: "filteredUsers", data: [] }
                );
            }

            const data = users
                .filter(user => user.administrator)
                .map(({ id, name, email, administrator }) => ({
                    id, name, email, administrator
                }));

            return makeResult(
                true,
                "Filter Applied",
                "Showing administrators only.",
                data.length,
                { preview: "filteredUsers", data }
            );
        }
    },

    {
        id: "orderby",
        name: "ORDER BY",
        description: "Ordena usuários",

        sql: `SELECT id, name, email, administrator
FROM users
ORDER BY name ASC;`,

        run() {
            if (!createdUsers) {
                return makeResult(
                    false,
                    "Table Not Found",
                    "The users table does not exist.",
                    0,
                    { preview: "sortedUsers", data: [] }
                );
            }

            const data = [...users]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(({ id, name, email, administrator }) => ({
                    id, name, email, administrator
                }));

            return makeResult(
                true,
                "Results Sorted",
                "Records ordered by name, ascending.",
                data.length,
                { preview: "sortedUsers", data }
            );
        }
    },

    {
        id: "createOrders",
        name: "CREATE TABLE (orders)",
        description: "Cria tabela de pedidos",

        sql: `CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT NOT NULL,
  product TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`,

        run() {
            if (createdOrders) {
                return makeResult(
                    false,
                    "Table Already Exists",
                    "Table orders already exists."
                );
            }

            if (!createdUsers) {
                return makeResult(
                    false,
                    "Referenced Table Not Found",
                    "Create the users table before creating orders."
                );
            }

            createdOrders = true;
            orders = [];

            return makeResult(
                true,
                "Table Created",
                "Table orders created successfully.\n0 rows inserted."
            );
        }
    },

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
                return makeResult(
                    false,
                    "Table Not Found",
                    "Execute CREATE TABLE orders before inserting data."
                );
            }

            if (orders.length > 0) {
                return makeResult(
                    false,
                    "Orders Already Exist",
                    "The orders table already contains records.",
                    0,
                    { preview: "orders", data: orders }
                );
            }

            const validationError = validateOrders(ordersSeed);

            if (validationError) {
                return makeResult(
                    false,
                    "Constraint Violation",
                    validationError,
                    0,
                    { preview: "orders", data: orders }
                );
            }

            orders = structuredClone(ordersSeed);

            return makeResult(
                true,
                "Orders Registered",
                `${orders.length} orders successfully inserted.`,
                orders.length,
                { preview: "orders", data: orders }
            );
        }
    },

    {
        id: "groupby",
        name: "GROUP BY",
        description: "Agrupa pedidos por usuário",

        sql: `SELECT user_id, COUNT(*) AS total
FROM orders
GROUP BY user_id;`,

        run() {
            if (!createdOrders) {
                return makeResult(
                    false,
                    "Table Not Found",
                    "The orders table does not exist.",
                    0,
                    { preview: "groups", data: [] }
                );
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

            return makeResult(
                true,
                "Groups Created",
                "Orders grouped by user_id.",
                data.length,
                { preview: "groups", data }
            );
        }
    },

    {
        id: "join",
        name: "JOIN",
        description: "Combina usuários e pedidos",

        sql: `SELECT users.name, orders.product, orders.total
FROM users
JOIN orders ON users.id = orders.user_id;`,

        run() {
            if (!createdUsers || !createdOrders) {
                return makeResult(
                    false,
                    "Table Not Found",
                    "Both users and orders must exist.",
                    0,
                    { preview: "joined", data: [] }
                );
            }

            const data = orders.map(order => {
                const user = users.find(
                    item => item.id === order.user_id
                );

                return user ? {
                    name: user.name,
                    product: order.product,
                    total: order.total
                } : null;
            }).filter(Boolean);

            return makeResult(
                true,
                "Tables Joined",
                "Matching users and orders.",
                data.length,
                { preview: "joined", data }
            );
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
                return makeResult(
                    false,
                    "Table Not Found",
                    "The users table does not exist."
                );
            }

            const index = users.findIndex(user => user.id === 2);

            if (index === -1) {
                return makeResult(
                    false,
                    "No Rows Updated",
                    "No user found with id 2."
                );
            }

            users[index] = {
                ...users[index],
                administrator: true
            };

            return makeResult(
                true,
                "Record Updated",
                "Updated administrator for user id 2.",
                1
            );
        }
    },

    {
        id: "delete",
        name: "DELETE",
        description: "Apaga usuários",

        sql: `DELETE FROM users
WHERE id = 4;`,

        run() {
            if (!createdUsers) {
                return makeResult(
                    false,
                    "Table Not Found",
                    "The users table does not exist."
                );
            }

            const target = users.find(user => user.id === 4);

            if (!target) {
                return makeResult(
                    false,
                    "No Rows Deleted",
                    "No user found with id 4."
                );
            }

            if (orders.some(order => order.user_id === 4)) {
                return makeResult(
                    false,
                    "Foreign Key Constraint",
                    "Cannot delete user 4 because related orders exist."
                );
            }

            users = users.filter(user => user.id !== 4);

            return makeResult(
                true,
                "Record Deleted",
                "Removed user with id 4.",
                1
            );
        }
    },

    {
        id: "dropOrders",
        name: "DROP TABLE (orders)",
        description: "Apaga a tabela de pedidos",

        sql: `DROP TABLE orders;`,

        run() {
            if (!createdOrders) {
                return makeResult(
                    false,
                    "Table Not Found",
                    "The orders table does not exist."
                );
            }

            createdOrders = false;
            orders = [];

            return makeResult(
                true,
                "Table Dropped",
                "Table orders no longer exists."
            );
        }
    },

    {
        id: "drop",
        name: "DROP TABLE (users)",
        description: "Apaga a tabela de usuários",

        sql: `DROP TABLE users;`,

        run() {
            if (!createdUsers) {
                return makeResult(
                    false,
                    "Table Not Found",
                    "The users table does not exist."
                );
            }

            if (createdOrders) {
                return makeResult(
                    false,
                    "Foreign Key Constraint",
                    "Drop the orders table before dropping users."
                );
            }

            createdUsers = false;
            users = [];

            return makeResult(
                true,
                "Table Dropped",
                "Table users no longer exists."
            );
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
        /('[^']*'|\b(?:CREATE|TABLE|INSERT|INTO|VALUES|SELECT|FROM|WHERE|ORDER|BY|ASC|DESC|GROUP|JOIN|ON|UPDATE|SET|DELETE|DROP|AND|OR|AS|COUNT|TRUE|FALSE|NULL|INT|INTEGER|TEXT|BOOLEAN|VARCHAR|DECIMAL|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|UNIQUE|DEFAULT|CHECK|DISTINCT|LIMIT)\b|\b\d+(?:\.\d+)?\b|[=<>]+)/gi;

    let result = "";
    let last = 0;
    let match;

    while ((match = pattern.exec(line)) !== null) {
        result += escapeHTML(line.slice(last, match.index));

        const token = match[0];
        let cls = "kw";

        if (token.startsWith("'")) {
            cls = "str";
        } else if (/^\d+(?:\.\d+)?$/.test(token)) {
            cls = "num";
        } else if (/^[=<>]+$/.test(token)) {
            cls = "operator";
        } else if (
            /^(INT|INTEGER|TEXT|BOOLEAN|VARCHAR|DECIMAL)$/i.test(token)
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
    const isError = result.success === false;

    document.getElementById("resultMessage").textContent =
        result.message;

    document.getElementById("resultDetail").innerHTML =
        escapeHTML(result.detail ?? "").replace(/\n/g, "<br>");

    document.getElementById("resultStatus").textContent =
        isError ? "STATUS: FAIL" : "STATUS: PASS";

    document.getElementById("resultRows").textContent =
        `${result.rows ?? 0} ${result.rows === 1 ? "ROW" : "ROWS"
        }`;

    document.getElementById("resultPass").textContent =
        isError ? "● ERROR" : "● SUCCESS";

    const resultIcon = document.getElementById("resultIcon");

    resultIcon.textContent = isError ? "!" : "✓";
    resultIcon.classList.toggle("error", isError);
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
document.getElementById("resultIcon").textContent = "✓";

const initialCard = document.querySelector('[data-id="create"]');

if (initialCard) {
    initialCard.classList.add("active");
    initialCard.setAttribute("aria-pressed", "true");
}

// Deixa CREATE TABLE selecionado, sem executar o comando.
document.querySelector('[data-id="create"]').classList.add("active");
document.querySelector('[data-id="create"]').setAttribute("aria-pressed", "true");