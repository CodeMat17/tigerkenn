import React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({
  name,
  email,
  message,
}) => {
  // Split message by line breaks to handle paragraph spacing
  const messageParagraphs = message
    .split("\n")
    .filter((paragraph) => paragraph.trim() !== "");

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        color: "#333",
      }}>
      <h2 style={{ color: "#1a73e8", fontSize: "20px" }}>
        New Message from {name} (<a href={`mailto:${email}`}>{email}</a>)
      </h2>
      <div
        style={{
          margin: "10px 0",
          padding: "15px",
          border: "1px solid #e0e0e0",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
        }}>
        <h3 style={{ color: "#333", fontSize: "16px" }}>Message:</h3>
        <div>
       
          {messageParagraphs.map((paragraph, index) => (
            <p key={index} style={{ marginBottom: "10px" }}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmailTemplate;

{
  /* <footer
      style={{
        marginTop: "20px",
        fontSize: "12px",
        color: "#777",
        textAlign: "center",
      }}>
      <p>— Tigerkenn Homes Team</p>
    </footer> */
}
