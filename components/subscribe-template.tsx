import React from "react";

interface SubscribeTemplateProps {
 
  email: string;

}

const EmailTemplate: React.FC<SubscribeTemplateProps> = ({ email }) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        color: "#333",
      }}>
      <h2 style={{ color: "#1a73e8", fontSize: "20px" }}>
        Thank you! ({email})
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
          <p>
            Your subscription for Tigerkenn Homes newsletter is well received
            and we promise not to spam you.
          </p>
        </div>
      </div>
      <footer
        style={{
          marginTop: "20px",
          fontSize: "12px",
          color: "#777",
          textAlign: "center",
        }}>
        <p>— Tigerkenn Homes Team</p>
      </footer>
    </div>
  );
};

export default EmailTemplate;
