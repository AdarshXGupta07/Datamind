from sqlalchemy import create_engine, text
from urllib.parse import quote_plus

pw = 'Dhoni@28'
engine = create_engine('postgresql://postgres:' + quote_plus(pw) + '@localhost:1108/Sample')

sql = """
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    city VARCHAR(50),
    country VARCHAR(50),
    signup_date DATE,
    plan VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    category VARCHAR(50),
    price NUMERIC(10,2),
    stock INTEGER,
    created_at DATE
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER,
    total_amount NUMERIC(10,2),
    status VARCHAR(20),
    order_date DATE
);

CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    department VARCHAR(50),
    role VARCHAR(50),
    salary NUMERIC(10,2),
    hire_date DATE,
    manager_id INTEGER
);

INSERT INTO customers (name, email, city, country, signup_date, plan) VALUES
('Rahul Sharma', 'rahul@gmail.com', 'Mumbai', 'India', '2023-01-15', 'pro'),
('Priya Patel', 'priya@yahoo.com', 'Delhi', 'India', '2023-02-20', 'basic'),
('Amit Singh', 'amit@outlook.com', 'Bangalore', 'India', '2023-03-10', 'enterprise'),
('Sneha Reddy', 'sneha@gmail.com', 'Hyderabad', 'India', '2023-04-05', 'pro'),
('Vikram Nair', 'vikram@gmail.com', 'Chennai', 'India', '2023-04-18', 'basic'),
('Anjali Gupta', 'anjali@gmail.com', 'Pune', 'India', '2023-05-22', 'pro'),
('Rohan Mehta', 'rohan@hotmail.com', 'Kolkata', 'India', '2023-06-01', 'enterprise'),
('Kavya Iyer', 'kavya@gmail.com', 'Ahmedabad', 'India', '2023-06-15', 'basic'),
('Arjun Kumar', 'arjun@gmail.com', 'Jaipur', 'India', '2023-07-08', 'pro'),
('Deepika Rao', 'deepika@gmail.com', 'Surat', 'India', '2023-07-25', 'basic'),
('Karan Shah', 'karan@gmail.com', 'Lucknow', 'India', '2023-08-10', 'enterprise'),
('Meera Joshi', 'meera@gmail.com', 'Nagpur', 'India', '2023-08-28', 'pro'),
('Suresh Verma', 'suresh@gmail.com', 'Indore', 'India', '2023-09-12', 'basic'),
('Pooja Mishra', 'pooja@gmail.com', 'Bhopal', 'India', '2023-09-30', 'pro'),
('Nikhil Tiwari', 'nikhil@gmail.com', 'Patna', 'India', '2023-10-14', 'basic'),
('Riya Bansal', 'riya@gmail.com', 'Chandigarh', 'India', '2023-11-02', 'enterprise'),
('Aakash Pandey', 'aakash@gmail.com', 'Vadodara', 'India', '2023-11-18', 'pro'),
('Shreya Das', 'shreya@gmail.com', 'Coimbatore', 'India', '2023-12-05', 'basic'),
('Manish Yadav', 'manish@gmail.com', 'Kochi', 'India', '2023-12-20', 'pro'),
('Tanvi Chopra', 'tanvi@gmail.com', 'Vizag', 'India', '2024-01-08', 'enterprise');

INSERT INTO products (name, category, price, stock, created_at) VALUES
('Laptop Pro 15', 'Electronics', 85000.00, 45, '2023-01-01'),
('Wireless Mouse', 'Electronics', 1299.00, 200, '2023-01-01'),
('Mechanical Keyboard', 'Electronics', 4500.00, 150, '2023-02-01'),
('USB-C Hub', 'Electronics', 2200.00, 180, '2023-02-01'),
('Monitor 27inch', 'Electronics', 28000.00, 60, '2023-03-01'),
('Office Chair', 'Furniture', 12000.00, 35, '2023-03-01'),
('Standing Desk', 'Furniture', 22000.00, 20, '2023-04-01'),
('Notebook Set', 'Stationery', 350.00, 500, '2023-04-01'),
('Pen Drive 64GB', 'Electronics', 799.00, 300, '2023-05-01'),
('Webcam HD', 'Electronics', 3500.00, 90, '2023-05-01'),
('Headphones BT', 'Electronics', 6500.00, 75, '2023-06-01'),
('Desk Lamp LED', 'Furniture', 1800.00, 120, '2023-06-01'),
('Backpack Pro', 'Accessories', 2500.00, 85, '2023-07-01'),
('Phone Stand', 'Accessories', 599.00, 250, '2023-07-01'),
('Portable SSD', 'Electronics', 7200.00, 55, '2023-08-01'),
('Cable Organizer', 'Accessories', 399.00, 400, '2023-08-01'),
('Whiteboard', 'Stationery', 3200.00, 40, '2023-09-01'),
('Sticky Notes Pack', 'Stationery', 199.00, 600, '2023-09-01'),
('Laptop Stand', 'Accessories', 1500.00, 110, '2023-10-01'),
('Smart Speaker', 'Electronics', 4999.00, 65, '2023-10-01');

INSERT INTO orders (customer_id, product_id, quantity, total_amount, status, order_date) VALUES
(1, 1, 1, 85000.00, 'delivered', '2023-02-01'),
(1, 2, 2, 2598.00, 'delivered', '2023-03-15'),
(2, 8, 5, 1750.00, 'delivered', '2023-03-20'),
(3, 5, 1, 28000.00, 'delivered', '2023-04-01'),
(3, 6, 1, 12000.00, 'delivered', '2023-04-10'),
(4, 11, 1, 6500.00, 'delivered', '2023-05-05'),
(5, 3, 1, 4500.00, 'delivered', '2023-05-18'),
(6, 10, 1, 3500.00, 'shipped', '2023-06-02'),
(7, 7, 1, 22000.00, 'delivered', '2023-06-20'),
(8, 9, 2, 1598.00, 'delivered', '2023-07-01'),
(9, 15, 1, 7200.00, 'delivered', '2023-07-10'),
(10, 14, 3, 1797.00, 'delivered', '2023-07-28'),
(11, 4, 2, 4400.00, 'shipped', '2023-08-05'),
(12, 20, 1, 4999.00, 'delivered', '2023-08-15'),
(13, 13, 1, 2500.00, 'delivered', '2023-09-01'),
(14, 19, 2, 3000.00, 'delivered', '2023-09-18'),
(15, 12, 1, 1800.00, 'cancelled', '2023-10-05'),
(16, 16, 4, 1596.00, 'delivered', '2023-10-22'),
(17, 17, 1, 3200.00, 'shipped', '2023-11-08'),
(18, 18, 10, 1990.00, 'delivered', '2023-11-25'),
(19, 1, 1, 85000.00, 'delivered', '2023-12-10'),
(20, 11, 2, 13000.00, 'delivered', '2023-12-28'),
(1, 5, 1, 28000.00, 'delivered', '2024-01-05'),
(2, 15, 1, 7200.00, 'shipped', '2024-01-15'),
(3, 20, 1, 4999.00, 'processing', '2024-01-20');

INSERT INTO employees (name, department, role, salary, hire_date, manager_id) VALUES
('Rajesh Kumar', 'Engineering', 'CTO', 250000.00, '2020-01-01', NULL),
('Pradeep Singh', 'Engineering', 'Senior Engineer', 120000.00, '2020-03-15', 1),
('Anita Sharma', 'Engineering', 'Engineer', 85000.00, '2021-06-01', 2),
('Sunil Gupta', 'Engineering', 'Engineer', 80000.00, '2021-08-15', 2),
('Neha Patel', 'Product', 'VP Product', 200000.00, '2020-02-01', NULL),
('Rohit Jain', 'Product', 'Product Manager', 110000.00, '2021-01-10', 5),
('Pooja Verma', 'Product', 'Product Analyst', 75000.00, '2022-03-20', 6),
('Amit Das', 'Sales', 'VP Sales', 180000.00, '2020-04-01', NULL),
('Kavita Rao', 'Sales', 'Sales Manager', 95000.00, '2021-05-15', 8),
('Ravi Mishra', 'Sales', 'Sales Executive', 60000.00, '2022-07-01', 9),
('Sunita Nair', 'Sales', 'Sales Executive', 58000.00, '2022-09-10', 9),
('Deepak Shah', 'Marketing', 'VP Marketing', 175000.00, '2020-06-01', NULL),
('Meghna Iyer', 'Marketing', 'Marketing Manager', 90000.00, '2021-07-20', 12),
('Arun Tiwari', 'Marketing', 'Content Writer', 55000.00, '2022-11-01', 13),
('Sonal Bansal', 'HR', 'HR Manager', 85000.00, '2021-02-15', NULL),
('Vikas Yadav', 'HR', 'HR Executive', 50000.00, '2022-05-01', 15),
('Rekha Chopra', 'Finance', 'CFO', 220000.00, '2020-01-15', NULL),
('Manoj Pandey', 'Finance', 'Finance Manager', 100000.00, '2021-03-01', 17),
('Swati Das', 'Finance', 'Accountant', 65000.00, '2022-08-15', 18),
('Kiran Reddy', 'Engineering', 'Junior Engineer', 70000.00, '2023-01-10', 2);
"""

with engine.connect() as conn:
    conn.execute(text(sql))
    conn.commit()
    print("Done! All tables and data created successfully.")
    
    tables = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")).fetchall()
    for t in tables:
        count = conn.execute(text("SELECT COUNT(*) FROM " + t[0])).fetchone()[0]
        print(t[0] + ": " + str(count) + " rows")
