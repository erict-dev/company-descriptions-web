import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Form, Button } from "react-bootstrap";

export default function Home() {
  const [companies, setCompanies] = useState("");
  const [companyDescriptions, setCompanyDescriptions] = useState(null);

  const handleChange = (event) => {
    setCompanies(event.target.value);
  };

  const fetchCompanyDescriptions = async () => {
    const query = companies;
    const data = await fetch(`/api/hello?tickers=${query}`);
    const json = await data.json();
    setCompanyDescriptions(json);
  };

  function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
    });
  }

  const renderCompanyDescriptions = () => {
    return companyDescriptions.map((c) => (
      <div key={c.ticker}>
        <h4>{c.ticker}</h4>
        <p>{unicodeToChar(c.description)}</p>
      </div>
    ));
  };

  const handleSubmit = async (event) => {
    fetchCompanyDescriptions();
    event.preventDefault();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Company Descriptions</title>
        <meta
          name="description"
          content="Easily compile company descriptions based on stock ticker"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h2 className={styles.description}>
          Get company descriptions based on stock tickers.
        </h2>

        <Form className={styles.form} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Stock tickers</Form.Label>
            <Form.Control
              type="text"
              placeholder="MSFT,SHOP,MRNA,PFE"
              onChange={handleChange}
              value={companies}
            />
            <Form.Text className="text-muted">
              Each entry should be separated by a comma.
            </Form.Text>
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            onClick={async () => fetchCompanyDescriptions()}
          >
            Get descriptions
          </Button>
        </Form>

        <div className={styles.companyDescriptions}>
          {companyDescriptions ? renderCompanyDescriptions() : null}
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://erict.dev" target="_blank" rel="noopener noreferrer">
          Powered by erict.dev
        </a>
      </footer>
    </div>
  );
}
