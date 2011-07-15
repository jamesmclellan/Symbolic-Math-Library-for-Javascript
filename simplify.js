	////////////////////////////////////////////////////////////////////////////////////
	
	function SimplifyTerms(termInput)
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
		   
	       // go right to left, per the order of operations:
		   // 1. handle groups first (actually, do not handle groups at all)
		   // 2. handle exponents
		   // 3. handle multiplication/division
		   //    0. set a latch for copying terms into the results array for this stage.
		   //       i. Initially, if the latch is low, copy each term to the results array.
		   //       ii. However, if a multiply/divide operation is encountered, set the latch high.
		   //       iii. While the latch is high, copy terms into the array which will be simplified.
		   //       iv. When the last term is found, set the latch back low, perform the simplification, and copy the results to the results array
		   //    a. Look for strings of multiply/divide operations
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
               simplifiedTerms = SimplifyMultiplicationDivision(activeTerms);
			   //alert("Simplify mult/div returned " + simplifiedTerms.length + " terms, value " + simplifiedTerms[0].unevaluatedString);
			   // copy the results of the simplification to a new CTerm
			   var myTerm = new CTerm("", nextTermType, false);
			   myTerm.terms = simplifiedTerms;
			   myTerm.unevaluatedString = Unparse(myTerm.terms);
			   myTerm.isNegative = DetermineSign(myTerm.terms);
			   myTerm.unevaluatedString = myTerm.unevaluatedString.replace(/^-/,""); // unparse places a "-" at the head of negative numbers, but we already know if the number is negative/positive, so trim this off
			   //alert("Pushing term " + myTerm.unevaluatedString + " type " + myTerm.relationshipToNextTerm + " isNegative " + myTerm.isNegative);
			   step3Terms.push(myTerm);		
			   activeTerms = []; 
			   bMultiplyDivideLatch = false;			   
			}
			// if we've come to the end of a string of multiplication/division operators, then it is time to work on
			//    the given string/array, then reset for the next possible string
			else if (bMultiplyDivideLatch)
			{		

			   // copy the results also to the final array
			   // :NOTE: The "i" index term has not yet been pushed onto the finalTerms array
			   //        that will happen later
			   //finalTerms = finalTerms.concat(simplifiedTerms);
			   // clear out activeterms array
			} // end of multiplication-division handling subsection
			else if (!bMultiplyDivideLatch)
			{
			   step3Terms.push(termInput.terms[i]);
			}
	   } // done with term loop
	   
	   if (activeTerms.length > 0) {	   
	       //alert("Called here too!");			
		   var myTerm = new CTerm("", "none", false);
		   myTerm.terms = SimplifyMultiplicationDivision(activeTerms);
		   myTerm.unevaluatedString = Unparse(myTerm.terms);
		   myTerm.unevaluatedString = myTerm.unevaluatedString.replace(/^-/,""); // unparse places a "-" at the head of negative numbers, but we already know if the number is negative/positive, so trim this off
		   //alert("Simplify mult/div returned " + unresolvedTerms.length + " terms");
		   step3Terms = step3Terms.concat(myTerm);
	   }

	   // 4. handle addition/subtraction
	   //alert("About to call add/sub with " + step3Terms.length + " terms. Term [0] = " + step3Terms[0].unevaluatedString);
       step4Terms = SimplifyAdditionSubtraction(step3Terms);
	   //alert("Simplify add/sub returned " + step4Terms.length + " terms");
	   PushToFinal(finalTerms, step4Terms);
	   if (finalTerms.length > 0)
	   {
	      finalTerms[finalTerms.length - 1].relationshipToNextTerm = "none";
	   }
	   //finalTerms.concat(step4Terms)
	  
	  // :TODO: Think the commented block below may be ready to trash. Do that and re-run all unit tests at some stable time
	   // if any terms are still unhandled, handle them now
	   //step3Terms = SimplifyMultiplicationDivision(activeTerms);
	   //step4Terms = SimplifyAdditionSubtraction(step3Terms);
	   //PushToFinal(finalTerms, step4Terms);
	   //finalTerms = finalTerms.concat(step4Terms);
	   //alert("Return value = " + simplifiedTerms[0].unevaluatedString );
	   return finalTerms;
	}
	
////////////////////////////////////////////////////////////////////////////////////
	
	function SimplifyAdditionSubtraction(step3Terms)
	{
	   //   :NOTE: Terms in the array may be complex (have multiple terms within them
	   //   0. create an array of grouped terms, where all terms within a multiply/divide group are single entries
	   //   a. create an array of equivalent terms using the associative property of multiplied items
	   //   b. if a subtraction term exists
	  var subtractionTerms = FindSubtractionInTermArray(step3Terms);
	  var additionTerms = FindAdditionInTermArray(step3Terms);	   
	  var simplifiedTerms = [];
	  
	   if (IsSubtractionInTermArray(step3Terms))   
	   {
			  //   c. see if that subtraction term matches a positive term (or equivalent)
              CancelAdditionSubtractionTerms(additionTerms, subtractionTerms, step3Terms);
			  
			  //   d. zero out both terms	   			  
		}
		  
  	    // put addition term array	  
	    for (var j = 0; j < additionTerms.length; j++)
	    {
		    if (additionTerms[j] != null)
		    {
			   //alert("Pushing add term " + additionTerms[j].unevaluatedString);
  			   //additionTerms[j].relationshipToNextTerm = "addition";
			   simplifiedTerms.push(additionTerms[j]);
		    }
	    }	   
	    // put subtraction term array
	    for (var j = 0; j < subtractionTerms.length; j++)
	    {
		    if (subtractionTerms[j] != null)
		    {
			   //alert("Pushing sub term " + subtractionTerms[j].unevaluatedString);
			   //subtractionTerms[j].relationshipToNextTerm = "subtraction";
   			   simplifiedTerms.push(subtractionTerms[j]);
		    }
	    }	   	  
	  
	    // if all terms cancel between numerators and denominators, then push a "1" to the output
	    if (simplifiedTerms.length == 0)
	    {
		   simplifiedTerms.push(new CTerm("0", "none"));
		   //alert("Adding zero term to results, value = " + simplifiedTerms[0].unevaluatedString );
	    }	  	
		// if, after all simplification is done, there is only a single term left, clear it's relationship to any other term
		// :NOTE: This might be a bad idea... don't I want to keep a +/- sign on the result??
	  
	    return simplifiedTerms;
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function SimplifyMultiplicationDivision(activeTerms)
	{
	   var numeratorTerms = FindNumeratorsInTermArray(activeTerms);
	   var denominatorTerms = FindDenominatorsInTermArray(activeTerms);			   
	   var simplifiedTerms = [];
	   
	   //alert("Done finding terms. Evaluating.");
	   
	   // i. Is there a term being divided by itself? simplify to "1"
	   if (IsDivideInTermArray(activeTerms))
	   {		  
          CancelMultiplicationDivision(numeratorTerms, denominatorTerms, activeTerms);  
	   } // end if divide terms in array
	   
	   // ii. Is there a multiply-by-zero anywhere in the term? simplify to "0"
	   if (IsZeroInTermArray(numeratorTerms))
	   {
		  var zeroTerm = new CTerm("0", "none");
		 // alert("Found a zero in terms.");
		  simplifiedTerms.push(zeroTerm);
	   }
	   else
	   {
	      //alert("Collecting remaining activeTerms. Length = " + activeTerms.length );
		  
		  // if there is not a zero, then push surviving numerators and denominators
		  for (var j = 0; j < numeratorTerms.length; j++)
		  {
			 if (numeratorTerms[j] != null)
			 {
			    //alert("Pushing term " + numeratorTerms[j].unevaluatedString);
				numeratorTerms[j].relationshipToNextTerm = "multiply";
				simplifiedTerms.push(numeratorTerms[j]);
			 }
		  }
		  var lastTerm = (simplifiedTerms.length) - 1;
		  
		  if (lastTerm >= 0)
		  {
			  if (CountArrayNotNull(denominatorTerms) > 0)
			  {
				 simplifiedTerms[lastTerm].relationshipToNextTerm = "divide";
			  }
			  else
			  {
				 simplifiedTerms[lastTerm].relationshipToNextTerm = "none";
			  }
		  }
		  
		  //
		  // :TODO: Present structure only handles a single denominator. Figure out a way to allow multiple denominators.
		  //
		  
		  for (var j = 0; j < denominatorTerms.length; j++)
		  {
			 if (denominatorTerms[j] != null)
			 {
			    //alert("Pushing term " + denominatorTerms[j].unevaluatedString);
				denominatorTerms[j].relationshipToNextTerm = "none";
				simplifiedTerms.push(denominatorTerms[j]);
			 }
		  }		  
		  //alert("Result of simplification " + simplifiedTerms.length + " items. ");
		  // if all terms cancel between numerators and denominators, then push a "1" to the output
		  if (simplifiedTerms.length == 0)
		  {
			simplifiedTerms.push(new CTerm("1", "none"));
			//alert("Adding unit term to results, value = " + simplifiedTerms[0].unevaluatedString );
		  }
	   }	
	   //alert("Return value = " + simplifiedTerms[0].unevaluatedString );
	   return(simplifiedTerms);
	}
		
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function PushToFinal(finalTerms, step4Terms)
	{
	   for (var i = 0; i < step4Terms.length; i++)
	   {
	     if (step4Terms[i].terms.length > 0)
		 {
			 for (var j = 0; j < step4Terms[i].terms.length; j++)
			 {
			   //alert("Pushing to final sub-term " + step4Terms[i].terms[j].unevaluatedString);
			   finalTerms.push(step4Terms[i].terms[j]);
			 }
		 } 
		 else 
		 {
		    //alert("Pushing to final term " + step4Terms[i].unevaluatedString);
		    finalTerms.push(step4Terms[i]);
		 }
	   }	
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
    function CancelAdditionSubtractionTerms(additionTerms, subtractionTerms, termArray)
	{
		  for (var j = 0; j < subtractionTerms.length; j++)
		  {
			for (var k = 0; k < additionTerms.length; k++)
			{
				if (additionTerms[k] != null)
				{
					if (subtractionTerms[j].unevaluatedString == additionTerms[k].unevaluatedString)
					{			
					   //alert("Cancelling terms found. Deleting subtraction term " + subtractionTerms[j].unevaluatedString + " and addition term " + additionTerms[k].unevaluatedString);
					   // delete from the termArray array
					   DeleteFromArray(termArray, subtractionTerms[j].id);
					   DeleteFromArray(termArray, additionTerms[k].id);					   
					   
					   // delete from the numeratorTerms and subtractionTerms array
					   DeleteFromArray(subtractionTerms, subtractionTerms[j].id);
					   DeleteFromArray(additionTerms, additionTerms[k].id);					   
					   
					   // break to next denominator
					   break;			
					}
				}
			}
		  }	
	}

	////////////////////////////////////////////////////////////////////////////////////
	
	function CancelMultiplicationDivision(numeratorTerms, denominatorTerms, activeTerms)
	{
		  //    (1) If there is any term to the right of a "divide" operation, save that term
		  //          (done in declaration of "denominatorTerms", above  
		  //    (2) Look at all terms to the left & right of "multiply" operations for a match. 
		  //           Also look at the term to the left of the "divide" operation for a match.
		  //    (3) If a match is found, delete both terms
		  //        (a) Set each term to "null" (this will be tested for later)
		  //        (b) Set the numerator
		  //alert("Found divisor in terms. Attempting to cancel numerators and denominators");	
	
		  for (var j = 0; j < denominatorTerms.length; j++)
		  {
			 for (var k = 0; k < numeratorTerms.length; k++)
			 {
				if (denominatorTerms[j].unevaluatedString == numeratorTerms[k].unevaluatedString)
				{
				   //alert("Deleting term '" + denominatorTerms[j].unevaluatedString + "' from denominator term array. ID = " + denominatorTerms[j].id);
				   //alert("Deleting term '" + numeratorTerms[k].unevaluatedString + "' from numerator term array. ID = " + numeratorTerms[k].id);
				   // delete from the activeTerms array
				   DeleteFromArray(activeTerms, denominatorTerms[j].id);
				   DeleteFromArray(activeTerms, numeratorTerms[k].id);					   
				   
				   // delete from the numeratorTerms and denominatorTerms array
				   DeleteFromArray(denominatorTerms, denominatorTerms[j].id);
				   DeleteFromArray(numeratorTerms, numeratorTerms[k].id);					   
				   
				   // break to next denominator
				   break;
				} 
			 } // end of numerator loop
		  } // end of denominator loop	
	}
	
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function DeleteFromArray(termInput, id)
	{
	   for (var i = 0; i < termInput.length; i++)
	   {
	      if (termInput[i] != null && termInput[i].id == id)
		  {
		     termInput[i] = null;
		  }
	   }	

	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function CountArrayNotNull(arrayIn)
	{
	  var returnValue = 0;
	  for (var i = 0; i < arrayIn.length; i++)
	  {
	    if (arrayIn[i] != null)
		{
		  returnValue++;
		}
	  }
	  return returnValue;
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function IsZeroInTermArray( termInput )
	{
	   for (var i = 0; i < termInput.length; i++)
	   {
	      if (termInput[i] != null && termInput[i].unevaluatedString == "0")
		  {
		     return true;
		  }
	   }
	   return false;
	}	

	////////////////////////////////////////////////////////////////////////////////////
	
	function IsSubtractionInTermArray( termInput )
	{
	   for (var i = 0; i < termInput.length; i++)
	   {
	      if (termInput[i] != null && termInput[i].relationshipToNextTerm == "subtraction" || termInput[i].isNegative)
		  {
		     return true;
		  }
	   }
	   return false;
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function FindSubtractionInTermArray( termInput )
	{
	   var returnValue = [];
	   
	   // :NOTE: The way the parsing works is that "-" symbols are interpreted as subtraction 
	   //        operations between positive numbers, unless it is impossible to interpret the term that way, in
	   //        which case the term is made a negative number.
	   //
	   for (var i = 0; i < (termInput.length - 1); i++)
	   {
	      if (termInput[i].relationshipToNextTerm == "subtraction")
		  {
		     //alert("Found subtraction term at position " + (i+1) + ", value " + termInput[i+1].unevaluatedString);
		     returnValue.push(termInput[i+1]);
		  }
	      if (termInput[i].isNegative)
		  {
		     //alert("Found negative term  at position " + (i) + ", value " + termInput[i].unevaluatedString);
		     returnValue.push(termInput[i]);
		  }		  
	   }
	   return returnValue;
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function FindAdditionInTermArray( termInput )
	{
	   var returnValue = [];
	   // :NOTE: There is a flaw here. This method of doing things assumes all numbers are positive and
	   //    related to one another by "addition" or "subtraction" operation.
	   //    I'm not sure this will work... negative numbers may need to exist.
	   
	   for (var i = 0; i < (termInput.length); i++)
	   {
	      if (i == 0 && termInput[i].isNegative == false)
		  {
  	         //alert("Found addition term " + termInput[i].unevaluatedString);
		     returnValue.push(termInput[i]);
		  }
	      else if (i > 0 && termInput[i-1].relationshipToNextTerm != "subtraction")
		  {
  	         //alert("Found addition term " + termInput[i].unevaluatedString);
		     returnValue.push(termInput[i]);
		  }
	   }
	   return returnValue;
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function IsDivideInTermArray( termInput )
	{
	   for (var i = 0; i < termInput.length; i++)
	   {
	      if (termInput[i] != null && termInput[i].relationshipToNextTerm == "divide")
		  {
		     return true;
		  }
	   }
	   return false;
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function FindNumeratorsInTermArray( termInput )
	{
	   var returnValue = [];
	   
	   for (var i = 0; i < (termInput.length); i++)
	   {
		  returnValue.push(termInput[i]);		  	   
	      if (termInput[i].relationshipToNextTerm == "divide")
		  {
			 i++; //skip next element (the denominator)
		  }
	   }
	   return returnValue;	
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function FindDenominatorsInTermArray( termInput )
	{
	   var returnValue = [];
	   
	   for (var i = 0; i < (termInput.length - 1); i++)
	   {
	      if (termInput[i].relationshipToNextTerm == "divide")
		  {
		     returnValue.push(termInput[i+1]);
		  }
	   }
	   return returnValue;
	}	
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function DetermineSign( termInput )
	{
	   var returnValue = false;
	   
	   // loop through the multiplicative term array looking for negative numbers
	   for (var i = 0; i < (termInput.length); i++)
	   {
	      if (termInput[i].isNegative)
		  {
		     // allow multiple negatives to negate eachother
		     returnValue = !returnValue;
		  }
	   }
	   return returnValue;
	}
	
	////////////////////////////////////////////////////////////////////////////////////	