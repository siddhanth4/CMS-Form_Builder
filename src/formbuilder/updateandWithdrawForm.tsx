import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFormResponseByResponseId } from "../Api/getFormResponseByResponseId";

const UpdateAndWithdrawForm = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { formId } = useParams<{ formId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!formId) {
          setError("No ID provided. Please access this page with an ID parameter.");
          setLoading(false);
          return;
        }

        // Fetch data from API
        const response = await getFormResponseByResponseId(Number(formId));
        console.log("=== API RESPONSE DEBUG ===");
        console.log("Full response object:", response);
        console.log("Response.FormResponse:", response?.FormResponse);
        console.log("FormResponse type:", typeof response?.FormResponse);
        console.log("FormResponse keys:", response?.FormResponse ? Object.keys(response.FormResponse) : 'No FormResponse');
        console.log("All response keys:", response ? Object.keys(response) : 'No response');
        
        // Check for common field names that might exist
        if (response?.FormResponse) {
          const possibleFields = ['organization', 'version', 'effectiveDate', 'dataControllerInfo', 'purposeOfProcessing', 'studentName', 'email', 'phone', 'address', 'formData'];
          console.log("Checking for possible fields:");
          possibleFields.forEach(field => {
            console.log(`  ${field}:`, response.FormResponse[field]);
          });
        }
        
        if (!response) {
          setError("Data not found.");
          setLoading(false);
          return;
        }

        setData(response.FormResponse);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data found</p>;

  return (
    <div key={formId} style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h2>Form Response Data</h2>
      
      <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", border: "1px solid #dee2e6" }}>
        <pre style={{ 
          whiteSpace: "pre-wrap", 
          wordBreak: "break-word", 
          fontFamily: "monospace",
          color: "#212529",
          backgroundColor: "transparent",
          fontSize: "14px",
          lineHeight: "1.5"
        }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default UpdateAndWithdrawForm;