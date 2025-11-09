import React from "react";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode; // A place to put buttons or other action elements
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, actions }) => {
  return (
    <div className={styles.pageHeader}>
      <h1 className={styles.pageTitle}>{title}</h1>
      <div>{actions}</div>
    </div>
  );
};

export default PageHeader;
