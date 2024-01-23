import React, { useState } from "react";
import jsPDF from "jspdf";
import "./companydetail.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
const GhgReportingForm = () => {
  const [companyName, setCompanyName] = useState("");
  const [companyOwner, setCompanyOwner] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [sector, setSector] = useState("steel");
  const [consolidation, setConsolidation] = useState("");
  const [otherSector, setOtherSector] = useState("");
  const [reportingYear, setReportingYear] = useState("");
  const [numPlants, setNumPlants] = useState(0);
  const [plantAddresses, setPlantAddresses] = useState(
    Array(numPlants).fill("")
  );
  const [numProductsPerPlant, setNumProductsPerPlant] = useState(
    Array(numPlants).fill(0)
  );
  const [productFuelUsage, setProductFuelUsage] = useState(
    Array(numPlants).fill([])
  );
  const [productEmissionFactors, setProductEmissionFactors] = useState(
    Array(numPlants)
      .fill([])
      .map(() => ({ CO2: 0, CH4: 0, N2O: 0 }))
  );
  const [productNames, setProductNames] = useState(
    Array(numPlants)
      .fill([])
      .map(() => [])
  );
  const [officeEmissionFactors, setOfficeEmissionFactors] = useState(
    Array.from({ length: numPlants }, () => [])
  );
  const [numOfficesPerPlant, setNumOfficesPerPlant] = useState(
    Array(numPlants).fill(0)
  );
  const [NumOutwardsPerPlant, setNumOutwardsPerPlant] = useState(
    Array(numPlants).fill(0)
  );
  const [NumOutwardsPerPlantExport, setNumOutwardsPerPlantExport] = useState(
    Array(numPlants).fill(0)
  );
  const [officeNames, setOfficeNames] = useState(
    Array(numPlants)
      .fill([])
      .map(() => [])
  );
  const [managerNames, setManagerNames] = useState(
    Array.from({ length: numPlants }, () => [])
  );
  const [officeElectricityUsage, setOfficeElectricityUsage] = useState([]);
  const [officeElectricityBill, setOfficeElectricityBill] = useState([]);
  const [officeElectricityFactor, setOfficeElectricityFactor] = useState([]);
  // const [officeAddressesPerPlant, setOfficeAddressesPerPlant] = useState(Array(numPlants).fill([]));
  const [domesticOutwardData, setDomesticOutwardData] = useState([]);
  const [exportOutwardData, setExportOutwardData] = useState([]);
  const [headOfficerNames, setHeadOfficerNames] = useState(
    Array(numPlants).fill("")
  );

  const handleOfficeEmissionFactorsChange = (
    plantIndex,
    officeIndex,
    gas,
    value
  ) => {
    setOfficeEmissionFactors((prevEmissionFactors) => {
      const updatedEmissionFactors = [...prevEmissionFactors];
      if (!updatedEmissionFactors[plantIndex]) {
        updatedEmissionFactors[plantIndex] = [];
      }
      if (!updatedEmissionFactors[plantIndex][officeIndex]) {
        updatedEmissionFactors[plantIndex][officeIndex] = {};
      }
      updatedEmissionFactors[plantIndex][officeIndex][gas] = parseFloat(value);
      return updatedEmissionFactors;
    });
  };
  const handleElectricityUsageChange = (
    plantIndex,
    officeIndex,
    monthIndex,
    newValue
  ) => {
    const updatedOfficeElectricityUsage = [...officeElectricityUsage];
    updatedOfficeElectricityUsage[plantIndex][officeIndex] = [
      ...(updatedOfficeElectricityUsage[plantIndex][officeIndex] || []),
    ];
    updatedOfficeElectricityUsage[plantIndex][officeIndex][monthIndex] =
      parseFloat(newValue);
    setOfficeElectricityUsage(updatedOfficeElectricityUsage);
  };

  const handleElectricityBillChange = (
    plantIndex,
    officeIndex,
    monthIndex,
    newValue
  ) => {
    const updatedOfficeElectricityBill = [...officeElectricityBill];
    updatedOfficeElectricityBill[plantIndex][officeIndex] = [
      ...(updatedOfficeElectricityBill[plantIndex][officeIndex] || []),
    ];
    updatedOfficeElectricityBill[plantIndex][officeIndex][monthIndex] =
      parseFloat(newValue);
    setOfficeElectricityBill(updatedOfficeElectricityBill);
  };

  const handleElectricityFactorChange = (
    plantIndex,
    officeIndex,
    monthIndex,
    newValue
  ) => {
    const updatedOfficeElectricityFactor = [...officeElectricityFactor];
    updatedOfficeElectricityFactor[plantIndex][officeIndex] = [
      ...(updatedOfficeElectricityFactor[plantIndex][officeIndex] || []),
    ];
    updatedOfficeElectricityFactor[plantIndex][officeIndex][monthIndex] =
      parseFloat(newValue);
    setOfficeElectricityFactor(updatedOfficeElectricityFactor);
  };

  const handleHeadOfficerNameChange = (plantIndex, value) => {
    setHeadOfficerNames((prevHeadOfficerNames) => {
      const updatedHeadOfficerNames = [...prevHeadOfficerNames];
      updatedHeadOfficerNames[plantIndex] = value;
      return updatedHeadOfficerNames;
    });
  };

  const handleDomesticOutwardDataChange = (
    plantIndex,
    outwardIndex,
    field,
    value
  ) => {
    const updatedData = [...domesticOutwardData];
    if (!updatedData[plantIndex]) {
      updatedData[plantIndex] = [];
    }
    if (!updatedData[plantIndex][outwardIndex]) {
      updatedData[plantIndex][outwardIndex] = {};
    }
    updatedData[plantIndex][outwardIndex][field] = value;
    setDomesticOutwardData(updatedData);
  };

  const handleExportOutwardDataChange = (
    plantIndex,
    outwardIndex,
    field,
    value
  ) => {
    setExportOutwardData((prevExportOutwardData) => {
      const updatedData = [...prevExportOutwardData];
      if (!updatedData[plantIndex]) {
        updatedData[plantIndex] = [];
      }
      if (!updatedData[plantIndex][outwardIndex]) {
        updatedData[plantIndex][outwardIndex] = {};
      }
      updatedData[plantIndex][outwardIndex][field] = value;
      return updatedData;
    });
  };

  const handleNumOutwardsChange = (plantIndex, event) => {
    const value = parseInt(event.target.value, 10) || 0;
    setNumOutwardsPerPlant((prevNumOutwards) => {
      const updatedNumOutwards = [...prevNumOutwards];
      updatedNumOutwards[plantIndex] = value;
      return updatedNumOutwards;
    });
  };
  const handleNumOutwardsChangeExport = (plantIndex, event) => {
    const value = parseInt(event.target.value, 10) || 0;
    setNumOutwardsPerPlantExport((prevNumOutwardsExport) => {
      const updatedNumOutwardsExport = [...prevNumOutwardsExport];
      updatedNumOutwardsExport[plantIndex] = value;
      return updatedNumOutwardsExport;
    });
  };

  const handleNumOfficesChange = (plantIndex, event) => {
    const value = parseInt(event.target.value, 10) || 0;
    setNumOfficesPerPlant((prevNumOffices) => {
      const updatedNumOffices = [...prevNumOffices];
      updatedNumOffices[plantIndex] = value;
      return updatedNumOffices;
    });
    setOfficeNames((prevOfficeNames) => {
      const updatedOfficeNames = [...prevOfficeNames];
      updatedOfficeNames[plantIndex] = Array(value).fill("");
      return updatedOfficeNames;
    });

    setOfficeElectricityUsage((prevElectricityUsage) => {
      const updatedElectricityUsage = [...prevElectricityUsage];
      updatedElectricityUsage[plantIndex] = Array(value).fill(
        Array(12).fill(0)
      );
      return updatedElectricityUsage;
    });
    setOfficeElectricityBill((prevElectricityBill) => {
      const updatedElectricityBill = [...prevElectricityBill];
      updatedElectricityBill[plantIndex] = Array(value).fill(Array(12).fill(0));
      return updatedElectricityBill;
    });
    setOfficeElectricityFactor((prevElectricityFactor) => {
      const updatedElectricityFactor = [...prevElectricityFactor];
      updatedElectricityFactor[plantIndex] = Array(value).fill(
        Array(12).fill(0)
      );
      return updatedElectricityFactor;
    });
  };

  const handleOfficeNameChange = (plantIndex, officeIndex, value) => {
    setOfficeNames((prevOfficeNames) => {
      const updatedOfficeNames = [...prevOfficeNames];
      updatedOfficeNames[plantIndex][officeIndex] = value;
      return updatedOfficeNames;
    });
  };

  const handleManagerNameChange = (plantIndex, officeIndex, value) => {
    setManagerNames((prevManagerNames) => {
      const updatedManagerNames = [...prevManagerNames];
      if (!updatedManagerNames[plantIndex]) {
        updatedManagerNames[plantIndex] = [];
      }
      updatedManagerNames[plantIndex][officeIndex] = value;
      return updatedManagerNames;
    });
  };

  const handleProductNameChange = (plantIndex, productIndex, value) => {
    setProductNames((prevProductNames) => {
      const updatedProductNames = [...prevProductNames];
      updatedProductNames[plantIndex][productIndex] = value;
      return updatedProductNames;
    });
  };

  const handleFuelUsageChange = (
    plantIndex,
    productIndex,
    monthIndex,
    event
  ) => {
    const newValue = event.target.value;

    setProductFuelUsage((prevProductFuelUsage) => {
      const updatedProductFuelUsage = [...prevProductFuelUsage];

      if (!updatedProductFuelUsage[plantIndex]) {
        updatedProductFuelUsage[plantIndex] = [];
      }
      if (!updatedProductFuelUsage[plantIndex][productIndex]) {
        updatedProductFuelUsage[plantIndex][productIndex] = [];
      }
      updatedProductFuelUsage[plantIndex][productIndex][monthIndex] = newValue;

      return updatedProductFuelUsage;
    });
  };

  const handleSectorChange = (event) => {
    const selectedSector = event.target.value;
    setSector(selectedSector);

    if (selectedSector !== "other") {
      setOtherSector("");
    }
  };
  const handleConsolidationChange = (event) => {
    const selectedConsolidation = event.target.value;
    setConsolidation(selectedConsolidation);
  };
  const handleNumPlantsChange = (event) => {
    const newNumPlants = parseInt(event.target.value, 10);
    if (!isNaN(newNumPlants)) {
      setNumPlants(newNumPlants);
      setNumProductsPerPlant(Array(newNumPlants).fill(0));
      setProductNames(
        Array(newNumPlants)
          .fill([])
          .map(() => [])
      );
      setProductFuelUsage(
        Array(newNumPlants)
          .fill([])
          .map(() => [])
      );
      setOfficeElectricityUsage(
        Array(newNumPlants)
          .fill([])
          .map(() => [])
      );
      setOfficeElectricityBill(
        Array(newNumPlants)
          .fill([])
          .map(() => [])
      );
      setOfficeElectricityUsage(
        Array(newNumPlants)
          .fill([])
          .map(() => [])
      );
      setProductEmissionFactors(
        Array(newNumPlants)
          .fill([])
          .map(() => ({ CO2: 0, CH4: 0, N2O: 0 }))
      );
      setNumOfficesPerPlant(Array(newNumPlants).fill(0));
      setPlantAddresses(Array(newNumPlants).fill(""));
      //   setOfficeAddressesPerPlant(Array(newNumPlants).fill([]));
    } else {
      setNumPlants(0);
      setNumProductsPerPlant([]);
      setProductNames([]);
      setProductFuelUsage([]);
      setOfficeElectricityUsage([]);
      setOfficeElectricityBill([]);
      setOfficeElectricityFactor([]);
      setProductEmissionFactors([]);

      setNumOfficesPerPlant([]);
      setPlantAddresses([]);
    }
  };
  const monthNames = [
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
  ];
  const handlePlantAddressChange = (index, value) => {
    const newPlantAddresses = [...plantAddresses];
    newPlantAddresses[index] = value;
    setPlantAddresses(newPlantAddresses);
  };





  const generatePdf = () => {
    const pdf = new jsPDF();

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

    pdf.text(
      45,
      180,
      `Inventory Scope: ${sector === "other" ? otherSector : sector}`
    );
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


  

  const handleNumProductsChange = (plantIndex, event) => {
    const newNumProducts = parseInt(event.target.value, 10);
    if (!isNaN(newNumProducts)) {
      setNumProductsPerPlant((prevNumProducts) => {
        const updatedNumProducts = [...prevNumProducts];
        updatedNumProducts[plantIndex] = newNumProducts;
        return updatedNumProducts;
      });

      setProductFuelUsage((prevFuelUsage) => {
        const updatedFuelUsage = [...prevFuelUsage];
        updatedFuelUsage[plantIndex] = Array(newNumProducts).fill(0);
        return updatedFuelUsage;
      });

      setProductEmissionFactors((prevEmissionFactors) => {
        const updatedEmissionFactors = [...prevEmissionFactors];
        updatedEmissionFactors[plantIndex] = Array(newNumProducts).fill({
          CO2: 0,
          CH4: 0,
          N2O: 0,
        });
        return updatedEmissionFactors;
      });
    } else {
      setNumProductsPerPlant((prevNumProducts) => {
        const updatedNumProducts = [...prevNumProducts];
        updatedNumProducts[plantIndex] = 0;
        return updatedNumProducts;
      });

      setProductFuelUsage((prevFuelUsage) => {
        const updatedFuelUsage = [...prevFuelUsage];
        updatedFuelUsage[plantIndex] = [];
        return updatedFuelUsage;
      });

      setProductEmissionFactors((prevEmissionFactors) => {
        const updatedEmissionFactors = [...prevEmissionFactors];
        updatedEmissionFactors[plantIndex] = [];
        return updatedEmissionFactors;
      });
    }
  };
  const handleEmissionFactorsChange = (
    plantIndex,
    productIndex,
    factor,
    value
  ) => {
    setProductEmissionFactors((prevFactors) => {
      const newFactors = [...prevFactors];
      newFactors[plantIndex][productIndex] = {
        ...newFactors[plantIndex][productIndex],
        [factor]: parseFloat(value),
      };
      return newFactors;
    });
  };

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("token");
    // const userIdObject = JSON.parse(token.userId);

    // Extract the "_id" value
    // const userId = userIdObject._id;
    const userId = token;
    const setr = {
      userId: userId,
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
    };

    console.log(setr);
    e.preventDefault();
    generatePdf();
    try {
      const url = "http://localhost:8080/submit";
      console.log(setr);
      const res = await axios.post(url, setr);
      localStorage.setItem("token", res.data.token.userId);
      window.location = "/";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1>GHG Reporting Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="companyName">Company Name:</label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={companyName}
          autoComplete="off"
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
        <br />
        <label htmlFor="companyOwner">Company Owner Name:</label>
        <input
          type="text"
          id="companyOwner"
          name="companyOwner"
          value={companyOwner}
          onChange={(e) => setCompanyOwner(e.target.value)}
          required
        />
        <br />
        <label htmlFor="companyDescription">Company Description:</label>
        <br />
        <textarea
          id="companyDescription"
          name="companyDescription"
          value={companyDescription}
          onChange={(e) => setCompanyDescription(e.target.value)}
          required
          rows={5}
          style={{ maxHeight: "8em", resize: "none" }}
        />
        <br />
        <label htmlFor="companyWebsite">Company Website:</label>
        <input
          type="url"
          id="companyWebsite"
          name="companyWebsite"
          value={companyWebsite}
          onChange={(e) => setCompanyWebsite(e.target.value)}
          pattern="https?://.+"
          title="Please enter a valid website URL, starting with http:// or https://"
          required
        />
        <br />
        <label htmlFor="sector">Sector:</label>
        <select
          id="sector"
          name="sector"
          required
          onChange={handleSectorChange}
          value={sector}
        >
          <option value="steel">Steel</option>
          <option value="cement">Cement</option>
          <option value="fertilizer">Fertilizer</option>
          <option value="other">Other</option>
        </select>

        {sector === "other" && (
          <div>
            <label htmlFor="otherSector">Other Sector:</label>
            <input
              type="text"
              id="otherSector"
              name="otherSector"
              value={otherSector}
              onChange={(e) => setOtherSector(e.target.value)}
              required
            />
          </div>
        )}
        <br></br>
        <label htmlFor="reportingYear">Reporting Year:</label>
        <input
          type="text"
          id="reportingYear"
          name="reportingYear"
          placeholder="YYYY-YY"
          autoComplete="off"
          pattern="\d{4}-\d{2}"
          value={reportingYear}
          onChange={(e) => setReportingYear(e.target.value)}
          required
        />
        <br />
        <label htmlFor="consolidation">Consolidation method:</label>
        <select
          id="consolidation"
          name="consolidation"
          required
          onChange={handleConsolidationChange}
          value={consolidation}
        >
          <option value="Equity share">Equity share </option>
          <option value="Financial control">Financial control </option>
          <option value="Operational control">Operational control</option>
        </select>
        <br />

        <label htmlFor="numPlants">Number of Plants:</label>
        <input
          type="number"
          id="numPlants"
          name="numPlants"
          min="1"
          value={numPlants || 0}
          required
          onChange={handleNumPlantsChange}
        />
        <br />
        {numPlants > 0 && (
          <div>
            {plantAddresses.map((plantAddress, plantIndex) => (
              <div key={plantIndex}>
                <h1>Plant {plantIndex + 1}</h1>
                <label htmlFor={`plantAddress${plantIndex + 1}`}>{`Plant ${
                  plantIndex + 1
                } Address:`}</label>
                <input
                  type="text"
                  id={`plantAddress${plantIndex + 1}`}
                  name={`plantAddress${plantIndex + 1}`}
                  value={plantAddress}
                  onChange={(e) =>
                    handlePlantAddressChange(plantIndex, e.target.value)
                  }
                  required
                />
                <br />
                <label
                  htmlFor={`headOfficerName${plantIndex + 1}`}
                >{`Head Officer Name for Plant ${plantIndex + 1}:`}</label>
                <input
                  type="text"
                  id={`headOfficerName${plantIndex + 1}`}
                  name={`headOfficerName${plantIndex + 1}`}
                  value={headOfficerNames[plantIndex] || ""}
                  onChange={(e) =>
                    handleHeadOfficerNameChange(plantIndex, e.target.value)
                  }
                  required
                />
                <h2>Category 1</h2>
                <label
                  htmlFor={`numProducts${plantIndex + 1}`}
                >{`Number of Products for Plant ${plantIndex + 1}:`}</label>
                <input
                  type="number"
                  id={`numProducts${plantIndex + 1}`}
                  name={`numProducts${plantIndex + 1}`}
                  min="0"
                  value={numProductsPerPlant[plantIndex]}
                  onChange={(e) => handleNumProductsChange(plantIndex, e)}
                />

                {numProductsPerPlant[plantIndex] > 0 && (
                  <div>
                    {Array.from(
                      { length: numProductsPerPlant[plantIndex] },
                      (_, productIndex) => (
                        <div key={productIndex}>
                          <label
                            htmlFor={`productName${plantIndex}_${
                              productIndex + 1
                            }`}
                          >
                            {`Product ${productIndex + 1} Name:`}
                          </label>
                          <input
                            type="text"
                            id={`productName${plantIndex}_${productIndex + 1}`}
                            name={`productName${plantIndex}_${
                              productIndex + 1
                            }`}
                            value={productNames[plantIndex][productIndex] || ""}
                            onChange={(e) =>
                              handleProductNameChange(
                                plantIndex,
                                productIndex,
                                e.target.value
                              )
                            }
                            required
                          />
                          <br />
                          <label
                            htmlFor={`fuelUsage${plantIndex}_${
                              productIndex + 1
                            }`}
                          >{`Fuel Usage for Product ${
                            productIndex + 1
                          } in Plant ${plantIndex + 1} (kgs):`}</label>
                          <br />
                          {monthNames.map((monthName, monthIndex) => (
                            <div key={monthIndex}>
                              <label
                                htmlFor={`fuelUsage${plantIndex}_${
                                  productIndex + 1
                                }_${monthName}`}
                              >
                                {monthName}
                              </label>
                              <input
                                type="number"
                                id={`fuelUsage${plantIndex}_${
                                  productIndex + 1
                                }_${monthName}`}
                                name={`fuelUsage${plantIndex}_${
                                  productIndex + 1
                                }_${monthName}`}
                                min="0"
                                value={
                                  productFuelUsage[plantIndex][productIndex][
                                    monthIndex
                                  ] || 0
                                }
                                onChange={(e) =>
                                  handleFuelUsageChange(
                                    plantIndex,
                                    productIndex,
                                    monthIndex,
                                    e
                                  )
                                }
                              />
                            </div>
                          ))}
                          <br />
                          <label
                            htmlFor={`emissionFactorCO2${plantIndex}_${
                              productIndex + 1
                            }`}
                          >{`Emission Factor CO2 for Product(in kgCO2/kg):`}</label>
                          <input
                            type="number"
                            id={`emissionFactorCO2${plantIndex}_${
                              productIndex + 1
                            }`}
                            name={`emissionFactorCO2${plantIndex}_${
                              productIndex + 1
                            }`}
                            min="0"
                            step="0.01"
                            value={
                              productEmissionFactors[plantIndex][productIndex]
                                .CO2
                            }
                            onChange={(e) =>
                              handleEmissionFactorsChange(
                                plantIndex,
                                productIndex,
                                "CO2",
                                e.target.value
                              )
                            }
                          />{" "}
                          <br />
                          <label
                            htmlFor={`emissionFactorCH4${plantIndex}_${
                              productIndex + 1
                            }`}
                          >{`Emission Factor of CH4 for Product(in kgCH4/kg):`}</label>
                          <input
                            type="number"
                            id={`emissionFactorCH4${plantIndex}_${
                              productIndex + 1
                            }`}
                            name={`emissionFactorCH4${plantIndex}_${
                              productIndex + 1
                            }`}
                            min="0"
                            step="0.01"
                            value={
                              productEmissionFactors[plantIndex][productIndex]
                                .CH4
                            }
                            onChange={(e) =>
                              handleEmissionFactorsChange(
                                plantIndex,
                                productIndex,
                                "CH4",
                                e.target.value
                              )
                            }
                          />{" "}
                          <br />
                          <label
                            htmlFor={`emissionFactorN2O${plantIndex}_${
                              productIndex + 1
                            }`}
                          >{`Emission Factor of N2O for Product(in kgN2O/kg):`}</label>
                          <input
                            type="number"
                            id={`emissionFactorN2O${plantIndex}_${
                              productIndex + 1
                            }`}
                            name={`emissionFactorN2O${plantIndex}_${
                              productIndex + 1
                            }`}
                            min="0"
                            step="0.01"
                            value={
                              productEmissionFactors[plantIndex][productIndex]
                                .N2O
                            }
                            onChange={(e) =>
                              handleEmissionFactorsChange(
                                plantIndex,
                                productIndex,
                                "N2O",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )
                    )}
                  </div>
                )}
                <br />

                <h2>Category 2</h2>

                <label
                  htmlFor={`numOffices${plantIndex + 1}`}
                >{`Number of Offices for Plant ${plantIndex + 1}:`}</label>
                <input
                  type="number"
                  id={`numOffices${plantIndex + 1}`}
                  name={`numOffices${plantIndex + 1}`}
                  min="0"
                  value={numOfficesPerPlant[plantIndex]}
                  onChange={(e) => handleNumOfficesChange(plantIndex, e)}
                />

                {Array.from(
                  { length: numOfficesPerPlant[plantIndex] },
                  (_, officeIndex) => (
                    <div key={officeIndex}>
                      <label
                        htmlFor={`officeName${plantIndex}_${officeIndex + 1}`}
                      >
                        {`Office ${officeIndex + 1} Name:`}
                      </label>
                      <input
                        type="text"
                        id={`officeName${plantIndex}_${officeIndex + 1}`}
                        name={`officeName${plantIndex}_${officeIndex + 1}`}
                        value={officeNames[plantIndex][officeIndex] || ""}
                        onChange={(e) =>
                          handleOfficeNameChange(
                            plantIndex,
                            officeIndex,
                            e.target.value
                          )
                        }
                        required
                      />
                      <br />
                      <label
                        htmlFor={`managerName${plantIndex}_${officeIndex + 1}`}
                      >
                        {`Manager Name for Office ${officeIndex + 1}:`}
                      </label>
                      <input
                        type="text"
                        id={`managerName${plantIndex}_${officeIndex + 1}`}
                        name={`managerName${plantIndex}_${officeIndex + 1}`}
                        value={managerNames[plantIndex]?.[officeIndex] || ""}
                        onChange={(e) =>
                          handleManagerNameChange(
                            plantIndex,
                            officeIndex,
                            e.target.value
                          )
                        }
                        required
                      />
                      <br />
                      <label
                        htmlFor={`electricityUsage${plantIndex}_${
                          officeIndex + 1
                        }`}
                      >
                        {`Electricity Usage for Office ${
                          officeIndex + 1
                        } in Plant ${plantIndex + 1}`}
                      </label>
                      <br />
                      provide Quantity Of Energy (in KVAH), Metered Electricity
                      bills(in Rs./Unit), Power Factor (PF) respectively :
                      {monthNames.map((monthName, monthIndex) => (
                        <div key={monthIndex}>
                          <label
                            htmlFor={`electricityUsage${plantIndex}_${
                              officeIndex + 1
                            }_${monthName}`}
                          >
                            {monthName}
                          </label>
                          <input
                            type="number"
                            id={`electricityUsage${plantIndex}_${
                              officeIndex + 1
                            }_${monthIndex}`}
                            name={`electricityUsage${plantIndex}_${
                              officeIndex + 1
                            }_${monthIndex}`}
                            min="0"
                            step="0.01"
                            value={
                              officeElectricityUsage[plantIndex][officeIndex][
                                monthIndex
                              ] || 0
                            }
                            onChange={(e) =>
                              handleElectricityUsageChange(
                                plantIndex,
                                officeIndex,
                                monthIndex,
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="number"
                            id={`electricityBill${plantIndex}_${
                              officeIndex + 1
                            }_${monthIndex}`}
                            name={`electricityBill${plantIndex}_${
                              officeIndex + 1
                            }_${monthIndex}`}
                            min="0"
                            value={
                              officeElectricityBill[plantIndex][officeIndex][
                                monthIndex
                              ] || 0
                            }
                            onChange={(e) =>
                              handleElectricityBillChange(
                                plantIndex,
                                officeIndex,
                                monthIndex,
                                e.target.value
                              )
                            }
                          />

                          <input
                            type="number"
                            id={`electricityFactor${plantIndex}_${
                              officeIndex + 1
                            }_${monthIndex}`}
                            name={`electricityFactor${plantIndex}_${
                              officeIndex + 1
                            }_${monthIndex}`}
                            min="0"
                            value={
                              officeElectricityFactor[plantIndex][officeIndex][
                                monthIndex
                              ] || 0
                            }
                            onChange={(e) =>
                              handleElectricityFactorChange(
                                plantIndex,
                                officeIndex,
                                monthIndex,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                      <label
                        htmlFor={`officeEmissionFactorCO2${plantIndex}_${
                          officeIndex + 1
                        }`}
                      >
                        {`Emission Factor CO2 for Office ${
                          officeIndex + 1
                        } (kgCO2/kg):`}
                      </label>
                      <input
                        type="number"
                        id={`officeEmissionFactorCO2${plantIndex}_${
                          officeIndex + 1
                        }`}
                        name={`officeEmissionFactorCO2${plantIndex}_${
                          officeIndex + 1
                        }`}
                        min="0"
                        step="0.01"
                        value={
                          officeEmissionFactors[plantIndex]?.[officeIndex]
                            ?.CO2 || 0
                        }
                        onChange={(e) =>
                          handleOfficeEmissionFactorsChange(
                            plantIndex,
                            officeIndex,
                            "CO2",
                            e.target.value
                          )
                        }
                      />
                      <br />
                      <label
                        htmlFor={`officeEmissionFactorCH4${plantIndex}_${
                          officeIndex + 1
                        }`}
                      >
                        {`Emission Factor CH4 for Office ${
                          officeIndex + 1
                        } (kgCH4/kg):`}
                      </label>
                      <input
                        type="number"
                        id={`officeEmissionFactorCH4${plantIndex}_${
                          officeIndex + 1
                        }`}
                        name={`officeEmissionFactorCH4${plantIndex}_${
                          officeIndex + 1
                        }`}
                        min="0"
                        step="0.01"
                        value={
                          officeEmissionFactors[plantIndex]?.[officeIndex]
                            ?.CH4 || 0
                        }
                        onChange={(e) =>
                          handleOfficeEmissionFactorsChange(
                            plantIndex,
                            officeIndex,
                            "CH4",
                            e.target.value
                          )
                        }
                      />
                      <br />
                      <label
                        htmlFor={`officeEmissionFactorN2O${plantIndex}_${
                          officeIndex + 1
                        }`}
                      >
                        {`Emission Factor N2O for Office ${
                          officeIndex + 1
                        } (kgN2O/kg):`}
                      </label>
                      <input
                        type="number"
                        id={`officeEmissionFactorN2O${plantIndex}_${
                          officeIndex + 1
                        }`}
                        name={`officeEmissionFactorN2O${plantIndex}_${
                          officeIndex + 1
                        }`}
                        min="0"
                        step="0.01"
                        value={
                          officeEmissionFactors[plantIndex]?.[officeIndex]
                            ?.N2O || 0
                        }
                        onChange={(e) =>
                          handleOfficeEmissionFactorsChange(
                            plantIndex,
                            officeIndex,
                            "N2O",
                            e.target.value
                          )
                        }
                      />
                      <br />
                    </div>
                  )
                )}

                <h2>Category 3: Domestic</h2>

                <label
                  htmlFor={`numDomesticOutwards${plantIndex + 1}`}
                >{`Number of Domestic Outwardsfor Plant ${
                  plantIndex + 1
                }:`}</label>
                <input
                  type="number"
                  id={`numDomesticOutwards${plantIndex + 1}`}
                  name={`numDomesticOutwards${plantIndex + 1}`}
                  min="0"
                  value={NumOutwardsPerPlant[plantIndex]}
                  onChange={(e) => handleNumOutwardsChange(plantIndex, e)}
                />
                {NumOutwardsPerPlant[plantIndex] > 0 && (
                  <div>
                    {Array.from(
                      { length: NumOutwardsPerPlant[plantIndex] },
                      (_, outwardIndex) => (
                        <div key={outwardIndex}>
                          <h3>Domestic Outward {outwardIndex + 1}</h3>
                          <label
                            htmlFor={`dateOfOutward${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Date of Outward:
                          </label>
                          <input
                            type="date"
                            id={`dateOfOutward${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            name={`dateOfOutward${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            value={
                              domesticOutwardData[plantIndex]?.[outwardIndex]
                                ?.dateOfOutward || ""
                            }
                            onChange={(e) =>
                              handleDomesticOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "dateOfOutward",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          <label
                            htmlFor={`clientName${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Name of Client:
                          </label>
                          <input
                            type="text"
                            id={`clientName${plantIndex}_${outwardIndex + 1}`}
                            name={`clientName${plantIndex}_${outwardIndex + 1}`}
                            value={
                              domesticOutwardData[plantIndex]?.[outwardIndex]
                                ?.clientName || ""
                            }
                            onChange={(e) =>
                              handleDomesticOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "clientName",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          <label
                            htmlFor={`productName${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Product Name:
                          </label>
                          <input
                            type="text"
                            id={`productName${plantIndex}_${outwardIndex + 1}`}
                            name={`productName${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            value={
                              domesticOutwardData[plantIndex]?.[outwardIndex]
                                ?.productName || ""
                            }
                            onChange={(e) =>
                              handleDomesticOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "productName",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          <label
                            htmlFor={`description${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Description:
                          </label>
                          <input
                            type="text"
                            id={`description${plantIndex}_${outwardIndex + 1}`}
                            name={`description${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            value={
                              domesticOutwardData[plantIndex]?.[outwardIndex]
                                ?.description || ""
                            }
                            onChange={(e) =>
                              handleDomesticOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "description",
                                e.target.value
                              )
                            }
                          />{" "}
                          <br />
                          <label
                            htmlFor={`quantity${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Quantity:
                          </label>
                          <input
                            type="number"
                            id={`quantity${plantIndex}_${outwardIndex + 1}`}
                            name={`quantity${plantIndex}_${outwardIndex + 1}`}
                            min="0"
                            value={
                              domesticOutwardData[plantIndex]?.[outwardIndex]
                                ?.quantity || 0
                            }
                            onChange={(e) =>
                              handleDomesticOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "quantity",
                                e.target.value
                              )
                            }
                          />{" "}
                          <br />
                          <label
                            htmlFor={`vehicleUsed${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Vehicle Used:
                          </label>
                          <input
                            type="text"
                            id={`vehicleUsed${plantIndex}_${outwardIndex + 1}`}
                            name={`vehicleUsed${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            value={
                              domesticOutwardData[plantIndex]?.[outwardIndex]
                                ?.vehicleUsed || ""
                            }
                            onChange={(e) =>
                              handleDomesticOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "vehicleUsed",
                                e.target.value
                              )
                            }
                          />{" "}
                          <br />
                          <label
                            htmlFor={`capacity${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Capacity:
                          </label>
                          <input
                            type="number"
                            id={`capacity${plantIndex}_${outwardIndex + 1}`}
                            name={`capacity${plantIndex}_${outwardIndex + 1}`}
                            min="0"
                            value={
                              domesticOutwardData[plantIndex]?.[outwardIndex]
                                ?.capacity || 0
                            }
                            onChange={(e) =>
                              handleDomesticOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "capacity",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          <label
                            htmlFor={`fuelUsed${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Fuel Used:
                          </label>
                          <input
                            type="text"
                            id={`fuelUsed${plantIndex}_${outwardIndex + 1}`}
                            name={`fuelUsed${plantIndex}_${outwardIndex + 1}`}
                            value={
                              domesticOutwardData[plantIndex]?.[outwardIndex]
                                ?.fuelUsed || ""
                            }
                            onChange={(e) =>
                              handleDomesticOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "fuelUsed",
                                e.target.value
                              )
                            }
                          />{" "}
                          <br />
                          <label
                            htmlFor={`from${plantIndex}_${outwardIndex + 1}`}
                          >
                            From:
                          </label>
                          <input
                            type="text"
                            id={`from${plantIndex}_${outwardIndex + 1}`}
                            name={`from${plantIndex}_${outwardIndex + 1}`}
                            value={
                              domesticOutwardData[plantIndex]?.[outwardIndex]
                                ?.from || ""
                            }
                            onChange={(e) =>
                              handleDomesticOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "from",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          <label
                            htmlFor={`to${plantIndex}_${outwardIndex + 1}`}
                          >
                            To:
                          </label>
                          <input
                            type="text"
                            id={`to${plantIndex}_${outwardIndex + 1}`}
                            name={`to${plantIndex}_${outwardIndex + 1}`}
                            value={
                              domesticOutwardData[plantIndex]?.[outwardIndex]
                                ?.to || ""
                            }
                            onChange={(e) =>
                              handleDomesticOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "to",
                                e.target.value
                              )
                            }
                          />{" "}
                          <br />
                          <label
                            htmlFor={`distanceCovered${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Distance Covered (km):
                          </label>
                          <input
                            type="number"
                            id={`distanceCovered${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            name={`distanceCovered${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            min="0"
                            value={
                              domesticOutwardData[plantIndex]?.[outwardIndex]
                                ?.distanceCovered || 0
                            }
                            onChange={(e) =>
                              handleDomesticOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "distanceCovered",
                                e.target.value
                              )
                            }
                          />{" "}
                          <br />
                          <label
                            htmlFor={`emissionFactorCO2${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Emission Factor CO2 (kg/km):
                          </label>
                          <input
                            type="number"
                            id={`emissionFactorCO2${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            name={`emissionFactorCO2${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            min="0"
                            step="0.01"
                            value={
                              domesticOutwardData[plantIndex]?.[outwardIndex]
                                ?.emissionFactorCO2 || 0
                            }
                            onChange={(e) =>
                              handleDomesticOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "emissionFactorCO2",
                                e.target.value
                              )
                            }
                          />{" "}
                          <br />
                          <label
                            htmlFor={`emissionFactorCH4${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Emission Factor CH4 (kg/km):
                          </label>
                          <input
                            type="number"
                            id={`emissionFactorCH4${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            name={`emissionFactorCH4${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            min="0"
                            step="0.01"
                            value={
                              domesticOutwardData[plantIndex]?.[outwardIndex]
                                ?.emissionFactorCH4 || 0
                            }
                            onChange={(e) =>
                              handleDomesticOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "emissionFactorCH4",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          <label
                            htmlFor={`emissionFactorN2O${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Emission Factor N2O (kg/km):
                          </label>
                          <input
                            type="number"
                            id={`emissionFactorN2O${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            name={`emissionFactorN2O${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            min="0"
                            step="0.01"
                            value={
                              domesticOutwardData[plantIndex]?.[outwardIndex]
                                ?.emissionFactorN2O || 0
                            }
                            onChange={(e) =>
                              handleDomesticOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "emissionFactorN2O",
                                e.target.value
                              )
                            }
                          />{" "}
                          <br />
                        </div>
                      )
                    )}
                  </div>
                )}
                <h2>Category 3: Export</h2>
                <label
                  htmlFor={`numExportOutwards${plantIndex + 1}`}
                >{`Number of Export Outwardsfor Plant ${
                  plantIndex + 1
                }:`}</label>
                <input
                  type="number"
                  id={`numExportOutwards${plantIndex + 1}`}
                  name={`numExportOutwards${plantIndex + 1}`}
                  min="0"
                  value={NumOutwardsPerPlantExport[plantIndex]}
                  onChange={(e) => handleNumOutwardsChangeExport(plantIndex, e)}
                />
                {NumOutwardsPerPlantExport[plantIndex] > 0 && (
                  <div>
                    {Array.from(
                      { length: NumOutwardsPerPlantExport[plantIndex] },
                      (_, outwardIndex) => (
                        <div key={outwardIndex}>
                          <h3>Export Outward {outwardIndex + 1}</h3>
                          <label
                            htmlFor={`dateOfOutwardExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Date of Receipt:
                          </label>
                          <input
                            type="date"
                            id={`dateOfOutwardExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            name={`dateOfOutwardExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            value={
                              exportOutwardData[plantIndex]?.[outwardIndex]
                                ?.dateOfOutward || ""
                            }
                            onChange={(e) =>
                              handleExportOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "dateOfOutward",
                                e.target.value
                              )
                            }
                          />
                          <br />

                          <label
                            htmlFor={`clientNameExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Name of Client:
                          </label>
                          <input
                            type="text"
                            id={`clientNameExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            name={`clientNameExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            value={
                              exportOutwardData[plantIndex]?.[outwardIndex]
                                ?.clientName || ""
                            }
                            onChange={(e) =>
                              handleExportOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "clientName",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          <label
                            htmlFor={`productNameExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Product Name:
                          </label>
                          <input
                            type="text"
                            id={`productNameExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            name={`productNameExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            value={
                              exportOutwardData[plantIndex]?.[outwardIndex]
                                ?.productName || ""
                            }
                            onChange={(e) =>
                              handleExportOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "productName",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          <label
                            htmlFor={`descriptionExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Description:
                          </label>
                          <input
                            type="text"
                            id={`descriptionExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            name={`descriptionExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            value={
                              exportOutwardData[plantIndex]?.[outwardIndex]
                                ?.description || ""
                            }
                            onChange={(e) =>
                              handleExportOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "description",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          <label
                            htmlFor={`quantityExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Quantity:
                          </label>
                          <input
                            type="number"
                            id={`quantityExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            name={`quantityExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            min="0"
                            value={
                              exportOutwardData[plantIndex]?.[outwardIndex]
                                ?.quantity || 0
                            }
                            onChange={(e) =>
                              handleExportOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "quantity",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          <label
                            htmlFor={`vehicleUsedExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Vehicle Used:
                          </label>
                          <input
                            type="text"
                            id={`vehicleUsedExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            name={`vehicleUsedExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            value={
                              exportOutwardData[plantIndex]?.[outwardIndex]
                                ?.vehicleUsed || ""
                            }
                            onChange={(e) =>
                              handleExportOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "vehicleUsed",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          <label
                            htmlFor={`capacityExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Capacity:
                          </label>
                          <input
                            type="number"
                            id={`capacityExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            name={`capacityExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            min="0"
                            value={
                              exportOutwardData[plantIndex]?.[outwardIndex]
                                ?.capacity || 0
                            }
                            onChange={(e) =>
                              handleExportOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "capacity",
                                e.target.value
                              )
                            }
                          />
                          <br />

                          <label
                            htmlFor={`fuelUsedExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Fuel Used:
                          </label>
                          <input
                            type="text"
                            id={`fuelUsedExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            name={`fuelUsedExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            value={
                              exportOutwardData[plantIndex]?.[outwardIndex]
                                ?.fuelUsed || ""
                            }
                            onChange={(e) =>
                              handleExportOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "fuelUsed",
                                e.target.value
                              )
                            }
                          />
                          <br />

                          <label
                            htmlFor={`fromExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            From:
                          </label>
                          <input
                            type="text"
                            id={`fromExport${plantIndex}_${outwardIndex + 1}`}
                            name={`fromExport${plantIndex}_${outwardIndex + 1}`}
                            value={
                              exportOutwardData[plantIndex]?.[outwardIndex]
                                ?.from || ""
                            }
                            onChange={(e) =>
                              handleExportOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "from",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          <label
                            htmlFor={`toExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            To:
                          </label>
                          <input
                            type="text"
                            id={`toExport${plantIndex}_${outwardIndex + 1}`}
                            name={`toExport${plantIndex}_${outwardIndex + 1}`}
                            value={
                              exportOutwardData[plantIndex]?.[outwardIndex]
                                ?.to || ""
                            }
                            onChange={(e) =>
                              handleExportOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "to",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          <label
                            htmlFor={`distanceCoveredExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Distance Covered (km):
                          </label>
                          <input
                            type="number"
                            id={`distanceCoveredExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            name={`distanceCoveredExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            min="0"
                            value={
                              exportOutwardData[plantIndex]?.[outwardIndex]
                                ?.distanceCovered || 0
                            }
                            onChange={(e) =>
                              handleExportOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "distanceCovered",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          <label
                            htmlFor={`emissionFactorCO2Export${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Emission Factor CO2 (kg/km):
                          </label>
                          <input
                            type="number"
                            id={`emissionFactorCO2Export${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            name={`emissionFactorCO2Export${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            min="0"
                            step="0.01"
                            value={
                              exportOutwardData[plantIndex]?.[outwardIndex]
                                ?.emissionFactorCO2 || 0
                            }
                            onChange={(e) =>
                              handleExportOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "emissionFactorCO2",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          <label
                            htmlFor={`emissionFactorCH4Export${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Emission Factor CH4 (kg/km):
                          </label>
                          <input
                            type="number"
                            id={`emissionFactorCH4Export${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            name={`emissionFactorCH4Export${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            min="0"
                            step="0.01"
                            value={
                              exportOutwardData[plantIndex]?.[outwardIndex]
                                ?.emissionFactorCH4 || 0
                            }
                            onChange={(e) =>
                              handleExportOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "emissionFactorCH4",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          <label
                            htmlFor={`emissionFactorN2OExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                          >
                            Emission Factor N2O (kg/km):
                          </label>
                          <input
                            type="number"
                            id={`emissionFactorN2OExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            name={`emissionFactorN2OExport${plantIndex}_${
                              outwardIndex + 1
                            }`}
                            min="0"
                            step="0.01"
                            value={
                              exportOutwardData[plantIndex]?.[outwardIndex]
                                ?.emissionFactorN2O || 0
                            }
                            onChange={(e) =>
                              handleExportOutwardDataChange(
                                plantIndex,
                                outwardIndex,
                                "emissionFactorN2O",
                                e.target.value
                              )
                            }
                          />

                          <br />
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <br />

        <div className="form-group form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="agreeCheckbox"
            required
          />
          <label className="form-check-label" htmlFor="agreeCheckbox">
            Agree to terms and conditions
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        {error && <div>{error}</div>}
      </form>
    </div>
  );
};

export default GhgReportingForm;
