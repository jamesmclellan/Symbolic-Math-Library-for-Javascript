	function PerformPartialDifferential(termInput, withRespectTo)
	{
	   // This function will loop through all the components of this.terms[] and do the following:
	   //  . Will create "equivalentExpressions" reflecting the associative properties of multiplied terms
	   //  . If there are negating terms, (e.g. A - A) will remove them
	   //  . If there are addable terms, (e.g. A + A), will add them (2A)
	   
	   //alert ("Simplify called");
	   var activeTerms = []; // the array of terms to be operated on
	   var simplifiedTerms = []; // the array of results -- final, simplified terms
	   var step3Terms = []; // term results of multiplication/division
	   var step4Terms = []; // term results of addition/subtraction
	   var finalTerms = [];
	   var bMultiplyDivideLatch = false;
	   
	   //
	   // :TODO: If an addition/subtraction operation occurs between multiply/division operations, preserve the +/-
	   //
	   
	   for (var i = 0; i < termInput.terms.length; i++)
	   {
          /*	   
	       // go right to left, per the order of operations
		   if (termInput.terms[i].relationshipToNextTerm == "multiply" ||
		       termInput.terms[i].relationshipToNextTerm == "divide")
		    {
			   //alert("Added term " + termInput.terms[i].unevaluatedString + " to active terms");
			   activeTerms.push(termInput.terms[i]);
			   bMultiplyDivideLatch = true;
			}
		    // qualify a term if the term comes immediately after a multiple/divide operator
			else if (i > 0 && 
			    (termInput.terms[i-1].relationshipToNextTerm == "multiply" ||
			     termInput.terms[i-1].relationshipToNextTerm == "divide"))
			{
			   //alert("Added term " + termInput.terms[i].unevaluatedString + " to active terms");
			   var nextTermType = termInput.terms[i].relationshipToNextTerm;
			   // :TODO: The "nextTermType" variable exists because somehow termInput.terms[i].relationshipToNextTerm is corrupted in the next few lines. Find the problem and fix it.
			   activeTerms.push(termInput.terms[i]);
               //alert("Calling simplify multi/div! Term = " + termInput.terms[i].unevaluatedString + " type " + termInput.terms[i].relationshipToNextTerm);			
			   if (activeTerms.length == 1)
			   {
                  simplifiedTerms = PerformSimplePartialDifferential(activeTerms);
			   }
			   //alert("Simplify mult/div returned " + simplifiedTerms.length + " terms, value " + simplifiedTerms[0].unevaluatedString);
			   // copy the results of the simplification to a new CTerm
               var myTerm = PackageMultDivReturnValue( simplifiedTerms, nextTermType );
			   //alert("Pushing term " + myTerm.unevaluatedString + " type " + myTerm.relationshipToNextTerm + " isNegative " + myTerm.isNegative);
			   step3Terms.push(myTerm);		
			   activeTerms = []; 
			   bMultiplyDivideLatch = false;			   
			}
			// if we've come to the end of a string of multiplication/division operators, then it is time to work on
			//    the given string/array, then reset for the next possible string
			else if (!bMultiplyDivideLatch)
			{
			   //alert("Blah2");
			   step3Terms.push(termInput.terms[i]);
			} // end of multiplication-division handling subsection
		  */
		  
		  var retValues = PerformSimplePartialDifferential(termInput.terms[i], withRespectTo);	
		  step3Terms.push(retValues);
	   } // done with term loop
	   
	   /*
	   if (activeTerms.length > 0) {	   
	       //alert("Called here too!");
		   if (activeTerms.length == 1) {
		      simplifiedTerms = PerformSimplePartialDifferential(activeTerms);	
		   }
		   //alert("Simplify multi/div returned " + unresolvedTerms.length + " terms");
           var myTerm = PackageMultDivReturnValue( simplifiedTerms, "none" );		   
		   //alert("Simplify mult/div returned " + unresolvedTerms.length + " terms");
		   step3Terms = step3Terms.push(myTerm);
	   }
	   */
	   
	   // 4. handle addition/subtraction
	   //alert("About to call add/sub with " + step3Terms.length + " terms. Term [0] = " + step3Terms[0].unevaluatedString);
       //step4Terms = PerformAddSubtractPar(step3Terms);
	   step4Terms = step3Terms;
	   //alert("Simplify add/sub returned " + step4Terms.length + " terms");
	   //alert("Simplify returned " + step4Terms[0].isNegative);
	   //PushToFinal(finalTerms, step4Terms);
	   //alert("PushToFinal returned " + finalTerms[0].isNegative);
	   //if (finalTerms.length > 0)
	   //{
	   //   finalTerms[finalTerms.length - 1].relationshipToNextTerm = "none";
	   //}

	   return step4Terms;	
	}
	
   //////////////////////////////////////////////////////////////////////

   function PerformSimplePartialDifferential(termInput, withRespectTo)
   {
      // assumes only one term
      var expValue = parseFloat(termInput.exponent.unevaluatedString);
	  var mulValue = parseFloat(termInput.multiplier);
	  var resultTerm = "";
	  
	  expValue -= 1;
	  
	  if (expValue == 0 && (termInput.unevaluatedString == withRespectTo))
	  {
	     var myTerm = new CTerm("1");
		 resultTerm = myTerm;
	  }	  
	  else if ( IsANumber(termInput) )
	  {
	 	 var myTerm = new CTerm("0");
		 resultTerm = myTerm; 
	  }
	  else if ( (expValue > 0) || (expValue < 0) )
	  {
	     mulValue *= (expValue + 1);
		 termInput.multiplier = "" + mulValue + "";
		 termInput.exponent.unevaluatedString = "" + expValue + "";
         resultTerm = termInput;		 
	  } else {
	     termInput.withRespectTo.push(withRespectTo);
	     resultTerm = termInput;
	  }
	  
	  return resultTerm;
   }