import { useState, useEffect } from "react";
import benefits from "./benefitsTable";
import options from "./options";
import Tippy from '@tippy.js/react'
import 'tippy.js/dist/tippy.css'

export default function MyForm() {
  const [inputs, setInputs] = useState({});
  const [finalResult, setFinalResult] = useState(false);
  const [familySizeExcludeSsiRecipients, setFamilySizeExcludeSsiRecipients] =
    useState(1);
  const [maxBenefit, setMaxBenefit] = useState("");
  const [actualBenefit, setActualBenefit] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);

  

  /*******calculations*****/
  const incomeDisregard = 550;

  let countIncome = (inputs.monthlyIncome - incomeDisregard) * 0.5;
      if (inputs.monthlyIncome - incomeDisregard <= 0) {
        countIncome = 0;
      }

  let result = (
    <div>
        {(actualBenefit > 0) ? 
        <div>
        <h2>Total Eligible Cash Benefit: <span className="actualBenefit">${actualBenefit}</span></h2> <p className="linkCenter">Apply online: 
        
        <a href="https://benefitscal.com/ApplyForBenefits/ABOVR" className="calworksLink" target='_blank' rel ='noopener noreferrer'> BenefitsCal.com </a> or 
      
        <a className="calworksLink" href="https://www.cdss.ca.gov/county-offices" target='_blank'  rel="noopener noreferrer"> contact your county social services agency</a> in your county. </p>
        </div>
        
        : 

        <h2>You are not eligible for cash benefits, but you are eligible for other <a className="calworksLink" href="https://www.cdss.ca.gov/inforesources/calworks" target="_blank" rel="noopener noreferrer">CalWORKs benefits</a>.</h2>}
    </div>
  );

  const actualBenefits = () => {
    setActualBenefit(maxBenefit - countIncome);
    return actualBenefit;
  };


  const benefitsCalc = () => {
    if (inputs.disability === "false" && inputs.location === "Other") {
      setMaxBenefit(benefits[familySizeExcludeSsiRecipients][2][1]);
      actualBenefits();
      //console.log("Region 2 NE", "actual benefit = " + actualBenefit);
    } else if (inputs.disability === "true" && inputs.location === "Other") {
      setMaxBenefit(benefits[familySizeExcludeSsiRecipients][3][1]);
      actualBenefits();
      //console.log("Region 2 E", "actual benefit = " + actualBenefit);
    } else if (inputs.disability === "true" && inputs.location) {
      setMaxBenefit(benefits[familySizeExcludeSsiRecipients][1][1]);
      actualBenefits();
      //console.log("Region 1 E", "actual benefit = " + actualBenefit);
    } else if (inputs.disability === "false" && inputs.location) {
      setMaxBenefit(benefits[familySizeExcludeSsiRecipients][0][1]);
      actualBenefits();
      //console.log("Region 1 NE", "actual benefit = " + actualBenefit);
    } else {
      setMaxBenefit("You entered wrong values. Please check!");
      //console.log("Wrong values entered");
    }
  };

  /*******end calculations*****/



  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((prevState) => ({ ...prevState, [name]: value }));
    setFamilySizeExcludeSsiRecipients(inputs.familySize - inputs.ssiRecipients);
    //benefitsCalc();
    setFinalResult(false); // doesn't show the modified result after the first submit click  
    //console.log(inputs)
  };


 useEffect(()=>{
  benefitsCalc();// update (rerender) actual benefits immediately without waiting for the next step
 }) 

  const handleSubmit = (event) => {
    event.preventDefault();
    setFinalResult(true);
    setDisableBtn(true);
    benefitsCalc();
    
    console.log(`Total Eligible Cash Benefit ${actualBenefit}`)
    
  };

  const handleReset = () => {
    setFinalResult(false);
    setInputs({});
    setFamilySizeExcludeSsiRecipients(1); 
    setActualBenefit('');
    setMaxBenefit('')
    setDisableBtn(false);
    
    console.log(actualBenefit)
  };

  return (
    <section className="main">
      <div className="wrapper">
        <h2>CalWORKs Cash Benefit Calculator</h2>
        {disableBtn ? <p>Thank you for submitting the form</p> : <p>Please input information to calculate how much cash benefit you can receive from CalWORKs</p> }

        <form
          className="formStyle"
          onSubmit={handleSubmit}
          onReset={handleReset}>
    
          <label>
            How many members are in your family including yourself?
            <input className="inputValue shortNum"
              type="number"
              name="familySize"
              value={inputs.familySize || ""}
              min={1}
              max={10}
              onChange={handleChange}
              placeholder="--"
              required/> 
          </label>

          <label>
            How many family members receive 
            <Tippy content='Supplemental Security Income'><span style={{fontStyle: 'italic', textDecoration:'underline'}}> SSI </span></Tippy>
            funds?
            <input className="inputValue shortNum"
              type="number"
              name="ssiRecipients"
              value={inputs.ssiRecipients || ""}
              min={0}
              max={inputs.familySize}
              onChange={handleChange}
              placeholder="--"
              required/>
          </label>

          <label>
            Which county do you live in?
            <select
              value={inputs.location}
              name="location"
              onChange={handleChange}
              defaultValue={""}
              required>

              {options.map((option)=>(
                <option key ={option.value} value={option.value}>{option.lable}</option>
              ))}
             </select>

          </label>

          <label>
            Do you have any disabilities?
            <select
              value={inputs.disability}
              name="disability"
              onChange={handleChange}
              defaultValue={""}
              required>
            
              <option value="" disabled hidden>
                Select an Option
              </option>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </label>

          <label>
            What is your monthly income?
            
            <input className="inputValue"
              type="number"
              name="monthlyIncome"
              value={inputs.monthlyIncome || ""}
              min={1}
              onChange={handleChange}
              placeholder="Enter a Value"
              
              required/>
          </label>

          <section className="btnOrder">
            <input id="disBTN" className="submitBTN" type="submit" value="Submit" disabled={disableBtn} />
            <input className="submitBTN" type="reset" />
          </section>
        </form>
      </div>
      
      
      {finalResult ? result : null}
      
    </section>
  );
}
