/* eslint-disable no-undef */
import { VscRunAll } from "react-icons/vsc";
import axios from 'axios'
import { useState, useContext } from "react";
import OutputContext from "./OutputContext";
import ProcessingContext from "./ProcessingContext";

export const Run = ({ code, language,CustomInput}) => {

  const { setOutput } = useContext(OutputContext);
  const { setProcessing } = useContext(ProcessingContext);

  const HandleRun = async () => {
    
    setProcessing(true);

    
    try {
      const res = await axios.post('http://localhost:3000/run', { code: code, language: language ,input:CustomInput});
      setProcessing(true);
      if (res.status === 200) {
       
        setOutput(res.data.output);
      } else {
        stderr
      }
    } catch (error) {
      
        console.log('An error occurred while sending the request.');
      
    }
    finally {
      setProcessing(false);
    }

  };


  return (
    <>

      <button className="bg-purple-300 mt-4 h-10 justify-center m-2 rounded-lg w-40 text-xl poppins-bold flex"
      onClick={HandleRun}
      >
        <VscRunAll className="mt-3" /> <span className="mt-2 mx-2  ">Run</span></button>
        
        
    </>
  )
}
