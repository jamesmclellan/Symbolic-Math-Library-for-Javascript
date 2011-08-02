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
               var myTerm = PackageMultDivReturnValue( simplifiedTerms, nextTermType );
			   //alert("Pushing term " + myTerm.unevaluatedString + " type " + myTerm.relationshipToNextTerm + " isNegative " + myTerm.isNegative);
			   step3Terms.push(myTerm);		
			   activeTerms = []; 
			   bMultiplyDivideLatch = false;			   
			}
			// if we've come to the end of a string of multiplication/division operators, then it is time to work on
			//    the given string/array, then reset for the next possible string
			else if (bMultiplyDivideLatch)
			{	
               // :TODO: This branch may be unnecessary. Investigate and remove.			
			   // :NOTE: The "i" index term has not yet been pushed onto the finalTerms array
			   //        that will happen later
			} 
			else if (!bMultiplyDivideLatch)
			{
			   step3Terms.push(termInput.terms[i]);
			} // end of multiplication-division handling subsection
	   } // done with term loop
	   
	   if (activeTerms.length > 0) {	   
	       //alert("Called here too!");			
		   simplifiedTerms = SimplifyMultiplicationDivision(activeTerms);	
           var myTerm = PackageMultDivReturnValue( simplifiedTerms, "none" );		   
		   //alert("Simplify mult/div returned " + unresolvedTerms.length + " terms");
		   step3Terms = step3Terms.push(myTerm);
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

	   return finalTerms;
	}

    ////////////////////////////////////////////////////////////////////////////////////
	
	function PackageMultDivReturnValue( valueToPackage, type )
	{
	   var myTerm = new CTerm("", type, false);
	   myTerm.terms = valueToPackage;
	   myTerm.unevaluatedString = Unparse(myTerm.terms);
	   //alert("Entering factorial loop to find equivalent terms for " + myTerm.unevaluatedString);
	   myTerm.equivalentTerms = FindEquivalentTerms(myTerm);
	   myTerm.isNegative = DetermineSign(myTerm.terms);
	   myTerm.unevaluatedString = myTerm.unevaluatedString.replace(/^-/,""); // unparse places a "-" at the head of negative numbers, but we already know if the number is negative/positive, so trim this off	   
	   return myTerm;
	}
	
    ////////////////////////////////////////////////////////////////////////////////////

    function FindEquivalentTerms( termInput )
    {
	   // This function is a wrapper for the factorial loop.
	   // It instances an evaluation function, sets the data and return attributes on that function object
	   //    and then starts the factorial loop
	   var returnArray = [];
	   var makeEquivalents = new ReEntrantWrapper;
	   makeEquivalents.functionToCall = MakeEquivalents;
	   makeEquivalents.terms = UnrelateTerms(termInput.terms);
	   makeEquivalents.returnArray = [];
	   
	   FactorialLoop(termInput.terms.length, makeEquivalents)
	   
	   //alert("Factorial loop found " + makeEquivalents.returnArray.length + " equivalent terms. Values " + PrintArray(makeEquivalents.returnArray));
	   returnArray = makeEquivalents.returnArray;
	   return returnArray;
    }	
	
    ////////////////////////////////////////////////////////////////////////////////////
	
	function MakeEquivalents( indexArray )
	{
	   // This function is an object intended to be passed into a factorial loop and evaluated
	   //   within that loop. It uses externally-set variables for data and return.
	   var tempArray = [];
	   var tempString = "";
	   
	   //alert("MakeEquivalents called with the following indices " + PrintArray(indexArray));
	   for (var i = 0; i < indexArray.length; i++)
	   {
	       // :NOTE: "terms" is an attribute generated outside this function
	       tempArray.push( this.terms[indexArray[i]] );  
	   }
 
       //alert("About to unparse terms array " + PrintCTermArray(tempArray));
       tempString = UnparseUnrelatedTerms(tempArray);
	   
	   // :NOTE: "returnArray" is an attribute generated outside this function
	   this.returnArray.push( tempString );
	}

    ////////////////////////////////////////////////////////////////////////////////////
	
	function PrintCTermArray(inputArray)
	{
	  var returnValue = "";
	  //alert("Print Array called with " + inputArray.length + " terms to print");
	  for (var i = 0 ; i < inputArray.length; i++)
	  {
	     returnValue += " " + inputArray[i].unevaluatedString;
	  }
	  return returnValue;
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
			  //   d. zero out both terms	
              CancelAdditionSubtractionTerms(additionTerms, subtractionTerms, step3Terms);   			  
		}
		  
  	    // put addition term array	  
	    for (var j = 0; j < additionTerms.length; j++)
	    {
		    if (additionTerms[j] != null)
		    {
			   //alert("Pushing add term " + additionTerms[j].unevaluatedString);
			   var closestPrevious = GetClosestPreviousValue(additionTerms, j);
			   if (closestPrevious >= 0)
			   { 
  			     additionTerms[closestPrevious].relationshipToNextTerm = "addition";
			   }
			   simplifiedTerms.push(additionTerms[j]);
		    }
	    }	   
	    // put subtraction term array
	    for (var j = 0; j < subtractionTerms.length; j++)
	    {
		    if (subtractionTerms[j] != null)
		    {
			   //alert("Pushing sub term " + subtractionTerms[j].unevaluatedString);
			   var closestPrevious = GetClosestPreviousValue(subtractionTerms, j);
			   if (closestPrevious >= 0)
			   {
			     subtractionTerms[closestPrevious].relationshipToNextTerm = "subtraction";
			   }
   			   simplifiedTerms.push(subtractionTerms[j]);
		    }
	    }	   	  
	  
	    // if all terms cancel between numerators and denominators, then push a "1" to the output
	    if (simplifiedTerms.length == 0)
	    {
		   simplifiedTerms.push(new CTerm("0", "none"));
		   //alert("Adding zero term to results, value = " + simplifiedTerms[0].unevaluatedString );
	    }	  	
	  
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
					else if(IsANumber(subtractionTerms[j].unevaluatedString) && IsANumber(additionTerms[k].unevaluatedString))
					{
					   // check to see if the two terms are constants, if so, just add them
					   SubtractConstant(subtractionTerms[j], parseFloat(additionTerms[k].unevaluatedString));
					   DeleteFromArray(termArray, additionTerms[k].id);		
					   DeleteFromArray(additionTerms, additionTerms[k].id);	
					   // how to handle sign change on the subtractionTerm???
					}
					else 
					{
					   var foundLatch = false;
					   //alert("Didn't find a match for subtraction term, try equivalent terms " + PrintTermArray(subtractionTerms[j].equivalentTerms));
					   // loop through the equivalent terms array to see if a match exists
					   for (var l = 0; l < subtractionTerms[j].equivalentTerms.length; l++)
					   {
							if (subtractionTerms[j].equivalentTerms[l] == additionTerms[k].unevaluatedString)
							{			
							   //alert("Cancelling terms found. Deleting subtraction term " + subtractionTerms[j].unevaluatedString + " and addition term " + additionTerms[k].unevaluatedString);
							   // delete from the termArray array
							   DeleteFromArray(termArray, subtractionTerms[j].id);
							   DeleteFromArray(termArray, additionTerms[k].id);					   
							   
							   // delete from the numeratorTerms and subtractionTerms array
							   DeleteFromArray(subtractionTerms, subtractionTerms[j].id);
							   DeleteFromArray(additionTerms, additionTerms[k].id);					   
							   
							   // break to next denominator
							   foundLatch = true
							   break;			
							} 					   
					   }
					   if (foundLatch == true)
					   {
					      break;
					   }
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
				   // subtract and add exponents
				   AddConstant(denominatorTerms[j].exponent, numeratorTerms[k].exponent)
				   
				   // preserve the sign of the pair to be deleted -- if it is negative, then push a "-1" onto the numerators stack
				   if (denominatorTerms[j].isNegative != numeratorTerms[k].isNegative)
				   {
				      var myTerm = new CTerm("1", "none", true);
					  numeratorTerms.push(myTerm);
					  activeTerms.push(myTerm);
				   }
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
	
	function GetClosestPreviousValue(arrayInput, currentPosition)
	{
	   var returnValue = -1;
	   
	   for (var i = (currentPosition-1); i >= 0; i--)
	   {
	     if (arrayInput[i] != null)
		 {
		   returnValue = i;
		   break;
		 }
	   }
	   
	   return returnValue;
	}	
	
	////////////////////////////////////////////////////////////////////////////////////	
	
	function IsANumber(termIn)
	{
	   if (IsNaN(parseFloat(termIn.unevaluatedString)))
	   {
	      return false;
	   }
	   else
	   {
	      return true;
	   }
	}
	
	////////////////////////////////////////////////////////////////////////////////////	
	
	function AddConstant(termIn, constantIn)
	{
	   for (var i=0; i < termIn.terms.length; i++)
	   {
	      if (IsANumber(termIn.terms[i]))
		  {
		     break;
		  }
	   }
	   if (i < termIn.terms.length)
	   {
	      var originalValue = parseFloat(termIn.terms[i]);
		  originalValue += constantIn;
		  termIn.terms[i] = "" + originalValue + "";
	   }
	   else 
	   {
	      var myTerm = new CTerm("" + constantIn + "", "none", false);
		  termIn.terms[i-1].relationshipToNextTerm = "addition";
		  termIn.terms.push(myTerm);
	   }
	}
	
	////////////////////////////////////////////////////////////////////////////////////	
	
	function SubtractConstant(termIn, constantIn)
	{
	   for (var i=0; i < termIn.terms.length; i++)
	   {
	      if (IsANumber(termIn.terms[i]))
		  {
		     break;
		  }
	   }
	   if (i < termIn.terms.length)
	   {
	      var originalValue = parseFloat(termIn.terms[i]);
		  originalValue -= constantIn;
		  termIn.terms[i] = "" + originalValue + "";
	   }
	   else 
	   {
	      var myTerm = new CTerm("" + constantIn + "", "none", false);
		  termIn.terms[i-1].relationshipToNextTerm = "subtraction";
		  termIn.terms.push(myTerm);
	   }
	}	