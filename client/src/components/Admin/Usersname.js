import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "./userstyle.css";
const UserReportsPage = () => {
  const [users, setUsers] = useState([]);
  const [userReports, setUserReports] = useState({});

  const generatePdf = (report) => {
    const pdf = new jsPDF();

    const {
      companyName,
      companyOwner,
      companyDescription,
      companyWebsite,
      sector,
      reportingYear,
      consolidation,
      numPlants,
      plantAddresses,
      numProductsPerPlant,
      productFuelUsage,
      productEmissionFactors,
      productNames,
      officeEmissionFactors,
      numOfficesPerPlant,
      NumOutwardsPerPlant,
      NumOutwardsPerPlantExport,
      officeNames,
      managerNames,
      officeElectricityUsage,
      officeElectricityBill,
      officeElectricityFactor,
      domesticOutwardData,
      exportOutwardData,
      headOfficerNames,
    } = report;

    const titleStyle = {
      fontSize: 60,
      font: "helvetica",
      fontStyle: "bold",
      textColor: [0, 128, 0],
    };

    const subtitleStyle = {
      fontSize: 30,
      font: "helvetica",
      textColor: [0, 0, 0],
    };

    const normalTextStyle = {
      fontSize: 20,
      font: "helvetica",
      textColor: [0, 0, 0],
    };

    pdf.setFontSize(titleStyle.fontSize);
    pdf.setTextColor.apply(this, titleStyle.textColor);
    pdf.setFont(titleStyle.font, titleStyle.fontStyle);

    pdf.text(100, 65, companyName, { align: "center" });

    pdf.setFontSize(subtitleStyle.fontSize);
    pdf.setTextColor.apply(this, subtitleStyle.textColor);
    pdf.setFont(subtitleStyle.font);

    pdf.text(105, 125, "GREENHOUSE GAS EMISSIONS REPORT", { align: "center" });

    pdf.setFontSize(normalTextStyle.fontSize);
    pdf.setTextColor.apply(this, normalTextStyle.textColor);
    pdf.setFont(normalTextStyle.font);

    pdf.text(45, 200, `Reporting Period: ${reportingYear}`);

    pdf.addPage();
    pdf.setFontSize(10);
    pdf.text(190, 10, companyName, { align: "right" });
    pdf.setFontSize(30);
    pdf.text(50, 20, "CONTENTS");
    pdf.setFontSize(10);
    pdf.text(20, 30, "CHAPTER 1: GENERAL DETAILS, PURPOSE AND POLICY");
    pdf.text(20, 35, "1.1 Introduction");
    pdf.text(20, 40, "1.2 Purpose ");
    pdf.text(20, 45, `1.3 Description of ${companyName}`);
    pdf.text(
      30,
      50,
      "1.3.1 GHG and Sustainability Policies, Strategies and Programmes"
    );
    pdf.text(20, 55, "1.4 Persons Responsible ");
    pdf.text(
      30,
      60,
      "1.4.1 Team Training for the Preparation of this Emissions Inventory and GHG Report "
    );
    pdf.text(20, 65, "1.5 Audience and Dissemination Policy ");
    pdf.text(20, 70, "1.6 Reporting Period and Frequency of Reporting ");
    pdf.text(20, 75, "1.7 Reporting Standards, Approach and Verification ");
    pdf.text(30, 80, "1.7.1 Compliance with ISO 14064-1:2018 ");
    pdf.text(30, 85, "1.7.2 Audit of GHG Inventory ");
    pdf.text(20, 90, "CHAPTER 2: ORGANISATIONAL BOUNDARIES");
    pdf.text(20, 95, "2.1 Consolidation Approach");
    pdf.text(20, 100, "2.2 Organisational Chart");

    pdf.text(20, 105, "CHAPTER 3: REPORTING BOUNDARIES ");
    pdf.text(20, 110, "3.1 Emissions Categories and Classification");
    pdf.text(20, 115, "3.2 Significance and Materiality");
    pdf.text(20, 120, "3.3 Summary of Emissions Source Inclusions ");
    pdf.text(20, 125, "3.4 Summary of Emissions Source Exclusions");

    pdf.text(20, 130, "CHAPTER 4: QUANTIFIED GHG INVENTORY OF EMISSIONS");
    pdf.text(20, 135, "4.1 Consolidated Statement of Greenhouse Gas Emissions");
    pdf.text(
      20,
      140,
      "4.2 Methodologies for the Collection and Quantification of Data"
    );
    pdf.text(30, 145, "4.2.1 Approach to Emission Factors");
    pdf.text(30, 150, "4.2.2 Changes in Methodologies on prior year/base year");
    pdf.text(30, 155, "4.2.3 GWP Calculation and Source");
    pdf.text(30, 160, "4.2.4 GHG Liabilities");
    pdf.text(30, 165, "4.2.5 Review, Internal Audit and Improvement");
    pdf.text(20, 170, "4.3 Information Management Procedures");
    pdf.text(
      30,
      175,
      "4.3.1 Key Procedural Elements for GHG Information Management"
    );
    pdf.text(20, 180, "4.4 Assessment of Uncertainty");
    pdf.text(20, 185, "4.5 Changes to Base Year");
    pdf.text(20, 190, "4.6 Removals and Reductions / Increases");
    pdf.text(30, 195, "4.6.1 Removals");
    pdf.text(30, 200, "4.6.2 Emissions Reductions / Increases");

    pdf.text(20, 205, "CHAPTER 5: INTERNAL REPORTING & PERFORMANCE");
    pdf.text(20, 210, "5.1 Emissions by Category and Gas");
    pdf.text(20, 215, "5.2 Emissions by Region");
    pdf.text(20, 220, "5.3 Emissions Intensity Measures");
    pdf.text(20, 225, "5.4 Freight Emissions by Mode");
    pdf.text(20, 230, "5.5 Performance Measures, Targets and Benchmarks");

    //CHAPTER 1
    const margin = 20;
    function addContentWithWrap(x, y, content, maxWidth) {
      pdf.text(x, y, pdf.splitTextToSize(content, maxWidth - margin * 2));
    }
    pdf.addPage();
    pdf.setFontSize(10);
    pdf.text(190, 10, companyName, { align: "right" });
    pdf.setFontSize(18);

    addContentWithWrap(
      20,
      20,
      `CHAPTER 1: GENERAL DETAILS, PURPOSE AND POLICY`,
      250
    );
    pdf.setFontSize(13);
    pdf.text(20, 30, "1.1 Introduction");
    pdf.setFontSize(10);

    addContentWithWrap(
      20,
      40,
      `The following document provides the ${companyName} Group of companies’ full global greenhouse gas (GHG) emissions inventory for the ${reportingYear} calendar year.`,
      230
    );
    addContentWithWrap(
      20,
      50,
      `${companyName}’s reporting processes and emissions classifications are consistent with international
protocols and standards. This report has been prepared in accordance with the International
Standards Organisation standard ISO 14064-1:2018. The information provided follows the
requirements outlined in Part 9.3.1 and (where applicable) 9.3.2 of the standard.`,
      230
    );

    pdf.setFontSize(13);
    pdf.text(20, 80, "1.2 Purpose");
    pdf.setFontSize(10);

    addContentWithWrap(
      20,
      90,
      `${companyName}’s intent here is to demonstrate best practice with respect to consistency, comparability, and completeness in the accounting of greenhouse gas emissions.`,
      230
    );
    addContentWithWrap(
      20,
      100,
      `This report:
\u2022 Relates to emissions for the ${companyName} Group of companies.
\u2022 Has been prepared in accordance with the requirements of the ISO 14064-1:2018 standard.
\u2022 Endeavours to use primary data wherever possible, especially surrounding all major emissions sources. Where primary data is not available, a consistent and conservative approach to calculation will be applied.
\u2022 Reflects our commitment to better understanding and ultimately improving our operational performance with respect to emissions.
\u2022 Excludes specific targets.`,
      230
    );

    pdf.setFontSize(13);
    pdf.text(20, 150, `1.3 Description of ${companyName}`);
    pdf.setFontSize(10);
    addContentWithWrap(20, 160, `${companyDescription}`, 230);
    pdf.setFontSize(12);
    pdf.text(
      20,
      200,
      "1.3.1 GHG and Sustainability Policies, Strategies and Programmes"
    );
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      210,
      `Our vision for a 100-year company is not about reaching an end-point. It’s a mind-set that every day
and every deed is about growing a strong, iconic, enduring business. This means leaving the place
better than we found it and doing all we can to safeguard the future of our people, our
communities and our planet.

Climate change remains a defining issue for businesses and governments everywhere. For
${companyName}, it begins with accepting that our business is based on an activity that generates carbon
emissions and therefore taking responsibility to reduce those emissions over time while
maintaining our competitiveness and ability to deliver quality services as our customers expect.
${companyName}’s commitment to sustainability, safety, health and the environment has been, and
continues to be, a fundamental element of our operating practices and success to date. For more
on ${companyName} sustainability please visit:

               ${companyWebsite}
`,
      230
    );

    pdf.addPage();
    pdf.setFontSize(10);
    pdf.text(190, 10, companyName, { align: "right" });
    pdf.setFontSize(13);
    pdf.text(20, 20, "1.4 Persons Responsible ");
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      30,
      `
The provided GHG Inventory and Report has been prepared by the ${companyOwner}
  

Support and preparation of the inventory:

${plantAddresses
  .map(
    (plantAddress, index) =>
      `\u2022 ${plantAddress} -> ${headOfficerNames[index]}
  `
  )
  .join("\n")}

  
Assisting with background data and supporting information:

${managerNames
  .map((managerName, i) =>
    managerNames
      .map(
        (managerName, index) =>
          `\u2022 ${plantAddresses[i]}-> ${officeNames[i][index]}-> ${managerNames[i][index]}
  `
      )
      .join("\n")
  )
  .join("\n")}
`,
      230
    );

    pdf.addPage();
    pdf.setFontSize(10);
    pdf.text(190, 10, companyName, { align: "right" });
    pdf.setFontSize(12);
    pdf.text(
      20,
      20,
      "1.4.1 Team Training for the Preparation of this Emissions Inventory and GHG Report"
    );
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      30,
      `Members of the core inventory preparation team are aware of all principles and requirements
within ISO 14064-1:2018 standard.

The inventory preparation team provided regional contributors with a detailed data input template
and instructions on collection of data in line with the standard.

`,
      230
    );

    pdf.setFontSize(13);
    pdf.text(20, 80, "1.5 Audience and Dissemination Policy");
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      90,
      `This report is intended for all ${companyName} stakeholders interested in its greenhouse gas emissions
inventory and the associated reporting structure, notation and explanations. It is provided publicly
following appropriate third party verification.
`,
      230
    );
    pdf.setFontSize(13);
    pdf.text(20, 120, "1.6 Reporting Period and Frequency of Reporting");
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      130,
      `This GHG report covers the year ${reportingYear} GHG reports are produced annually.
`,
      230
    );

    pdf.setFontSize(15);
    pdf.text(20, 160, "1.7 Reporting Standards, Approach and Verification");
    pdf.setFontSize(13);
    pdf.text(20, 170, "1.7.1 Compliance with ISO 14064-1:2018");
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      180,
      `The GHG report for the year ${reportingYear} has been prepared in accordance with ISO
14064-1:2018. A reporting index has been provided in appendix 1.
`,
      230
    );

    pdf.addPage();
    pdf.setFontSize(10);
    pdf.text(190, 10, companyName, { align: "right" });
    pdf.setFontSize(15);
    pdf.text(20, 20, "CHAPTER 2: ORGANISATIONAL BOUNDARIES");
    pdf.setFontSize(13);
    pdf.text(20, 30, "2.1 Consolidation Approach");
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      40,
      `${companyName} utilises the ‘${consolidation}’ consolidation method for our emissions inventory.
This approach considers all emissions that ${companyName} has control over.

The most significant application of this approach is the inclusion of emissions from our owner
drivers, agents, rail providers, shipping lines and airlines that support our service offering to
customers.

Franchises, although related to the ${companyName} Group, are not considered under its control and
have not been included in the emissions summary.`,
      230
    );

    pdf.setFontSize(13);
    pdf.text(20, 100, "2.2 Organisational Chart");
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      80,
      `The below organisational chart depicts the operating nature of the ${companyName} Group as is relevant
to the emissions summary.`,
      230
    );
    addContentWithWrap(
      20,
      120,
      `  ${companyName} has ${plantAddresses.length} Plants

${managerNames
  .map((managerName, i) =>
    managerNames
      .map(
        (managerName, index) =>
          `\u2022 ${plantAddresses[i]} has ${officeNames[i][index]}
    `
      )
      .join("\n")
  )
  .join("\n")}
  `,
      230
    );

    pdf.addPage();
    pdf.setFontSize(10);
    pdf.text(190, 10, companyName, { align: "right" });
    pdf.setFontSize(15);
    pdf.text(20, 20, "CHAPTER 3: REPORTING BOUNDARIES");
    pdf.setFontSize(13);
    pdf.text(20, 30, "3.1 Emissions Categories and Classification");
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      40,
      `Greenhouse gas emissions sources have been identified and grouped in accordance with the ISO
14064-1:2018 standard. This methodology lists three categories of emissions.

\u2022 Category 1: Direct GHG emissions and removals

\u2022 Category 2: Indirect GHG emissions from imported energy

\u2022 Category 3: Indirect GHG emissions from transportation

`,
      230
    );

    pdf.setFontSize(13);
    pdf.text(20, 100, "3.2 Significance and Materiality");
    pdf.setFontSize(10);

    addContentWithWrap(
      20,
      110,
      `Factors for consideration in assessing significance and materiality include:

\u2022 Size of the emissions

\u2022 ${companyName}’s influence on the emission source

\u2022 Difficulty in obtaining data

\u2022 Poor validity in available estimation approaches

Whilst all of the above would be considered in materiality assessments, the criteria that would
mandate disclosure of emissions sources as significant is:

a) Where there is a single source with estimated emissions likely to be at least 1% of
${companyName}’s total emissions. In this case, that emissions source must be included.

b) Where the total of ‘insignificant’ sources has estimated emissions likely to be at least 5% of
${companyName}’s total emissions. In this case, enough of the ‘insignificant’ emissions must be
included until the estimate of excluded emissions is below 5%.
`,
      230
    );

    const fileName = `ghg_report_${companyName.replace(/\s+/g, "_")}.pdf`;
    pdf.save(fileName);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/users");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      const reports = {};
      for (const user of users) {
        try {
          const response = await axios.get(
            `http://localhost:8080/reports/${user._id}`
          );
          reports[user._id] = response.data.reports;
        } catch (error) {
          console.error(`Error fetching reports for user ${user._id}:`, error);
        }
      }

      setUserReports(reports);
    };

    if (users.length > 0) {
      fetchReports();
    }
  }, [users]);

  return (
    <div>
      {users.map((user) => (
        <div key={user._id} style={{ marginBottom: "20px" }}>
          <h2>
            User: {user.firstName} {user.lastName}
          </h2>
          <p>Email: {user.email}</p>
          <p>{user._id}</p>
          {userReports[user._id] && (
            <div>
              {userReports[user._id].map((report) => (
                <div key={report._id} style={{ marginBottom: "10px" }}>
                  <h4>{report.companyName}</h4>

                  <button onClick={() => generatePdf(report)}>
                    Download Report
                  </button>
                </div>
              ))}
            </div>
          )}

          {!userReports[user._id] && <p>No reports available</p>}
        </div>
      ))}
    </div>
  );
};

export default UserReportsPage;
