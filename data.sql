\c biztime

-- DROP tables if they exist
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS companies;

-- CREATE companies table
CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

-- CREATE invoices table
CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK (amt > 0)
);

-- CREATE industries table
CREATE TABLE industries (
    
    code text NOT NULL ,
    industry text NOT NULL ,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE ,
    CONSTRAINT industries_unique_comp_code_industry UNIQUE (comp_code, industry)
);

-- INSERT data into companies table
INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX'),
         ('ibm', 'IBM', 'Big blue'),
         ('txiki-buho', 'txiki buho', 'awesome company');

-- INSERT data into invoices table
INSERT INTO invoices (comp_code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null),
         ('txiki-buho', 1400, true, '2018-01-01');

-- INSERT data into industries table
INSERT INTO industries (comp_code, code, industry)
  VALUES ('apple', 'tech', 'technology'),
         ('apple', 'ec', 'e-commerce'),
         ('ibm', 'tech', 'technology'),
         ('txiki-buho', 'ec', 'e-commerce');