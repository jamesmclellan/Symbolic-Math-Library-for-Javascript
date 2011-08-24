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
		   //alert("Term " + termInput.terms[i].unevaluatedString + ", type = " + termInput.terms[i].relationshipToNextTerm);
		   if (termInput.terms[i].isParenthetical)
		   {
		      // if we're about to push on the array, flush the existing activeterms array
			  FlushActiveTerms(activeTerms, simplifiedTerms, step3Terms, "multiply");
			  
		      termInput.terms[i].Evaluate(termInput.terms[i].unevaluatedString);
		      var resultTerm = new CTerm("");
		      resultTerm.terms = SimplifyTerms(termInput.terms[i]);
			  resultTerm.unevaluatedString = Unparse(resultTerm.terms); // unevaluate to get child's metadata into the parent term
			  step3Terms.push(resultTerm);
		   }
		   else if (termInput.terms[i].withRespectTo.length > 0)
		   {
		      // if we're about to push on the array, flush the existing activeterms array
			  //FlushActiveTerms(activeTerms, simplifiedTerms, step3Terms, "multiply");
			  
		      termInput.terms[i].Evaluate(termInput.terms[i].unevaluatedString); // evaluate the differential into individual terms; the parser moved the whole differential over
		      termInput.terms[i].terms = PerformPartialDifferential(termInput.terms[i], termInput.terms[i].withRespectTo[0]);
			  termInput.terms[i].unevaluatedString = Unparse(termInput.terms[i].terms); // unevaluate to get child's metadata into the parent term
			  termInput.terms[i].terms = [];
			  termInput.terms[i].Evaluate(termInput.terms[i].unevaluatedString); // perform a second evaluate to replace multiplier with real terms
			  termInput.terms[i].withRespectTo = []; // clear the withRespectTo array (this will need to be corrected)
			  // :TODO: Handle multiple differentials, example: dA/dxdy
			  // :TODO: Keep the trailing part of the differential in the output, example: dx(A^2) = 2*A*dA/dx
			  //step3Terms.push(termInput.terms[i]);
			  activeTerms.push(termInput.terms[i]);
		   }
		   else if (termInput.terms[i].relationshipToNextTerm == "multiply" ||
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
			else if (!bMultiplyDivideLatch)
			{
			   //alert("Blah2");
			   step3Terms.push(termInput.terms[i]);
			} // end of multiplication-division handling subsection
	   } // done with term loop
	   
       FlushActiveTerms(activeTerms, simplifiedTerms, step3Terms, "none");

	   // 4. handle addition/subtraction
	   //alert("About to call add/sub with " + step3Terms.length + " terms. Term [0] = " + step3Terms[0].unevaluatedString);
       step4Terms = SimplifyAdditionSubtraction(step3Terms);
	   //alert("Simplify add/sub returned " + step4Terms.length + " terms");
	   //alert("Simplify returned " + step4Terms[0].isNegative);
	   PushToFinal(finalTerms, step4Terms);
	   //alert("PushToFinal returned " + finalTerms[0].isNegative);
	   if (finalTerms.length > 0)
	   {
	      finalTerms[finalTerms.length - 1].relationshipToNextTerm = "none";
	   }

	   return finalTerms;
	}

    ////////////////////////////////////////////////////////////////////////////////////

    function FlushActiveTerms(activeTerms, simplifiedTerms, step3Terms, relation)
    {
	   if (activeTerms.length > 0) {	   
	       //alert("Called here too!");			
		   simplifiedTerms = SimplifyMultiplicationDivision(activeTerms);	
		   //alert("Simplify multi/div returned " + unresolvedTerms.length + " terms");
           var myTerm = PackageMultDivReturnValue( simplifiedTerms, relation );		   
		   //alert("Simplify mult/div returned " + unresolvedTerms.length + " terms");
		   step3Terms.push(myTerm);
		   while(activeTerms.length > 0)
		   {
		      activeTerms.pop();
		   }
	   }	
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
		  
        CollectAdditionSubtractionTerms(additionTerms, subtractionTerms, simplifiedTerms);	
	  
	    // if all terms cancel between numerators and denominators, then push a "1" to the output
	    if (simplifiedTerms.length == 0)
	    {
		   simplifiedTerms.push(new CTerm("0", "none"));
		   //alert("Adding zero term to results, value = " + simplifiedTerms[0].unevaluatedString );
	    }	  	
	  
	    return simplifiedTerms;
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function CollectAdditionSubtractionTerms(additionTerms, subtractionTerms, simplifiedTerms)
	{
  	    // put addition term array	  
	    for (var j = 0; j < additionTerms.length; j++)
	    {
		    
		    for (var k = j+1; k < additionTerms.length; k++)
			{
				if (additionTerms[j] != null && additionTerms[k] != null && 
				    IsANumber(additionTerms[j]) && IsANumber(additionTerms[k]))
				{
					var val1 = parseFloat(additionTerms[j].unevaluatedString);
					var val2 = parseFloat(additionTerms[k].unevaluatedString);
					
					var valResult = val1 + val2;
					additionTerms[j].unevaluatedString = "" + valResult + "";
					DeleteFromArray(additionTerms, additionTerms[k].id);				
				}
				
				if (additionTerms[j] != null && additionTerms[k] != null && 
				    (additionTerms[j].unevaluatedString == additionTerms[k].unevaluatedString))
				{
					var val1 = parseFloat(additionTerms[j].multiplier);
					var val2 = parseFloat(additionTerms[k].multiplier);
					
					var valResult = val1 + val2;
					additionTerms[j].multiplier = "" + valResult + "";
					DeleteFromArray(additionTerms, additionTerms[k].id);				
				}				
			}
		    
           if (additionTerms[j] != null)
           {		   
			   //alert("Pushing add term " + additionTerms[j].unevaluatedString);
			   var closestPrevious = GetClosestPreviousValue(additionTerms, j);
			   if (closestPrevious >= 0)
			   { 
				 additionTerms[closestPrevious].relationshipToNextTerm = "addition";
			   }
			   if ( parseFloat(additionTerms[j].multiplier) > 1)
			   {
			      var myTerm = new CTerm(additionTerms[j].multiplier, "multiply");
				  simplifiedTerms.push(myTerm);
			   }
			   simplifiedTerms.push(additionTerms[j]);			
		   }
	    }	
		
	    // put subtraction term array
	    for (var j = 0; j < subtractionTerms.length; j++)
	    {
		    
		    for (var k = j+1; k < subtractionTerms.length; k++)
			{
			   if (subtractionTerms[j] != null && subtractionTerms[k] != null &&
			       IsANumber(subtractionTerms[j]) && IsANumber(subtractionTerms[k]))
			   {
					var val1 = parseFloat(subtractionTerms[j].unevaluatedString);
					var val2 = parseFloat(subtractionTerms[k].unevaluatedString);
					
					var valResult = val1 + val2;
					subtractionTerms[j].unevaluatedString = "" + valResult + "";
					DeleteFromArray(subtractionTerms, subtractionTerms[k].id);	
		       }
				if (subtractionTerms[j] != null && subtractionTerms[k] != null && 
				    (subtractionTerms[j].unevaluatedString == subtractionTerms[k].unevaluatedString))
				{
					var val1 = parseFloat(subtractionTerms[j].multiplier);
					var val2 = parseFloat(subtractionTerms[k].multiplier);
					
					var valResult = val1 + val2;
					subtractionTerms[j].multiplier = "" + valResult + "";
					DeleteFromArray(subtractionTerms, subtractionTerms[k].id);				
				}							   
			}
			
			
		    if (subtractionTerms[j] != null)
		    {
			   //alert("Pushing sub term " + subtractionTerms[j].unevaluatedString);
			   var closestPrevious = GetClosestPreviousValue(subtractionTerms, j);
			   if (closestPrevious >= 0)
			   {
			     subtractionTerms[closestPrevious].relationshipToNextTerm = "subtraction";
			   }
			   if ( parseFloat(subtractionTerms[j].multiplier) > 1)
			   {
			      var myTerm = new CTerm(subtractionTerms[j].multiplier, "multiply");
				  simplifiedTerms.push(myTerm);
			   }			   
   			   simplifiedTerms.push(subtractionTerms[j]);
		    }
	    }	 
		
		if ((simplifiedTerms.length == 1) && (CountNonNull(subtractionTerms) > 0))
		{
		   //alert("Only one subtraction term. Making this term negative");
		   simplifiedTerms[0].isNegative = true;
		}		
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function CountNonNull( arrayIn )
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
	   
	   // collect remainin numerators and denominators, increasing exponents appropriately
	   CollectNumeratorDenominatorExponents(numeratorTerms, denominatorTerms, activeTerms);  
	   
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
          CollectNumeratorDenominatorTerms(simplifiedTerms, numeratorTerms, denominatorTerms);
	   }	
	   
	   //alert("Return value = " + simplifiedTerms[0].unevaluatedString );
	   return(simplifiedTerms);
	}

	////////////////////////////////////////////////////////////////////////////////////

    function CollectNumeratorDenominatorTerms(resultArray, numeratorTerms, denominatorTerms)
    {
		  // if there is not a zero, then push surviving numerators and denominators
		  for (var j = 0; j < numeratorTerms.length; j++)
		  {
			 if (numeratorTerms[j] != null)
			 {
			    //alert("Pushing term " + numeratorTerms[j].unevaluatedString);
				numeratorTerms[j].relationshipToNextTerm = "multiply";
				resultArray.push(numeratorTerms[j]);
			 }
		  }
		  var lastTerm = (resultArray.length) - 1;
		  
		  if (lastTerm >= 0)
		  {
			  if (CountArrayNotNull(denominatorTerms) > 0)
			  {
				 resultArray[lastTerm].relationshipToNextTerm = "divide";
			  }
			  else
			  {
				 resultArray[lastTerm].relationshipToNextTerm = "none";
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
				resultArray.push(denominatorTerms[j]);
			 }
		  }		  
		  //alert("Result of simplification " + resultArray.length + " items. ");
		  // if all terms cancel between numerators and denominators, then push a "1" to the output
		  if (resultArray.length == 0)
		  {
			resultArray.push(new CTerm("1", "none"));
			//alert("Adding unit term to results, value = " + resultArray[0].unevaluatedString );
		  }	
    }	
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function PushToFinal(finalTerms, step4Terms)
	{
	   for (var i = 0; i < step4Terms.length; i++)
	   {
	     if (step4Terms[i].terms.length > 1)
		 {
			 for (var j = 0; j < step4Terms[i].terms.length; j++)
			 {
			   // if this is the last subterm, give it the relationship of the parent
			   if (j == (step4Terms[i].terms.length - 1))
			   {
			      step4Terms[i].terms[j].relationshipToNextTerm = step4Terms[i].relationshipToNextTerm;
			   }
			   
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
	      //alert("Cancelling addition and subtraction terms");
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
					else if(IsANumber(subtractionTerms[j]) && IsANumber(additionTerms[k]))
					{
					   // check to see if the two terms are constants, if so, just add them
					   //alert("Subtracting two constants");
					   var resultsTerm = parseFloat(additionTerms[k].unevaluatedString) - parseFloat(subtractionTerms[j].unevaluatedString);
					   if (resultsTerm > 0)
					   {
					      DeleteFromArray(termArray, subtractionTerms[k].id);		
					      DeleteFromArray(subtractionTerms, subtractionTerms[k].id);
						  additionTerms[k].unevaluatedString = "" + resultsTerm + "";
						  break;
					   }
					   else if (resultsTerm < 0)
					   {
					      DeleteFromArray(termArray, additionTerms[k].id);		
					      DeleteFromArray(additionTerms, additionTerms[k].id);	
						  subtractionTerms[j].unevaluatedString = "" + (-1 * resultsTerm) + "";
					   }
					   else 
					   {
					      DeleteFromArray(termArray, additionTerms[k].id);		
					      DeleteFromArray(additionTerms, additionTerms[k].id);	
					      DeleteFromArray(termArray, subtractionTerms[k].id);		
					      DeleteFromArray(subtractionTerms, subtractionTerms[k].id);
						  break;
					   }
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
				if ( denominatorTerms[j] != null && numeratorTerms[k] != null &&
				   denominatorTerms[j].unevaluatedString == numeratorTerms[k].unevaluatedString)
				{
				   // subtract and add exponents
				   var numeratorExponent = numeratorTerms[k].exponent;
				   var denominatorExponent = denominatorTerms[j].exponent;
				   var resultExponent = 0;
                   // if both exponents are constants, perform subtraction, otherwise do nothing
				   if (IsANumber(numeratorExponent) && IsANumber(denominatorExponent))
				   {
				      var numeratorExponentValue = parseFloat(numeratorExponent.unevaluatedString);
					  var denominatorExponentValue = parseFloat(denominatorExponent.unevaluatedString);
					  
					  resultExponent = numeratorExponentValue - denominatorExponentValue;
				   }
				   else
				   {
				      continue;
				   }
				   
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
				   if (resultExponent > 0)
				   {
				      DeleteFromArray(activeTerms, denominatorTerms[j].id);
					  DeleteFromArray(denominatorTerms, denominatorTerms[j].id);
                      numeratorTerms[k].exponent.unevaluatedString = "" + resultExponent + "";
					  break;
				   }
				   else if (resultExponent < 0)
				   {
				      DeleteFromArray(activeTerms, numeratorTerms[k].id);
					  DeleteFromArray(numeratorTerms, numeratorTerms[k].id);
					  denominatorTerms[j].exponent.unevaluatedString = "" + resultExponent + "";
				   }
				   else 
				   {
				      DeleteFromArray(activeTerms, denominatorTerms[j].id);
					  DeleteFromArray(denominatorTerms, denominatorTerms[j].id);
				      DeleteFromArray(activeTerms, numeratorTerms[k].id);
					  DeleteFromArray(numeratorTerms, numeratorTerms[k].id);
					  break;
				   }
				} 
				else if ( IsANumber(denominatorTerms[j]) && IsANumber(numeratorTerms[k]) )
				{
				   var val1 = parseFloat(numeratorTerms[k].unevaluatedString);
				   var val2 = parseFloat(denominatorTerms[j].unevaluatedString);
				   
				   var valResult = val1 / val2;
				   numeratorTerms[k].unevaluatedString = "" + valResult + "";
				   DeleteFromArray(activeTerms, denominatorTerms[j].id);
				   DeleteFromArray(denominatorTerms, denominatorTerms[j].id);
                   break;				   
				}
			 } // end of numerator loop
		  } // end of denominator loop	
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function CollectNumeratorDenominatorExponents(numeratorTerms, denominatorTerms, activeTerms)
	{
	   for (var j = 0; j < denominatorTerms.length; j++)
	   {
	      for (var k = j+1; k < denominatorTerms.length; k++)
		  {
		     if ( ((denominatorTerms[j] != null) && (denominatorTerms[k] != null)) && (denominatorTerms[j].unevaluatedString == denominatorTerms[k].unevaluatedString) &&
			      (IsANumber(denominatorTerms[j].exponent) && IsANumber(denominatorTerms[k].exponent)) )
			 {
			    var exp1 = parseFloat(denominatorTerms[j].exponent.unevaluatedString);
				var exp2 = parseFloat(denominatorTerms[k].exponent.unevaluatedString);
				
				var expResult = exp1 + exp2;
				denominatorTerms[j].exponent.unevaluatedString = "" + expResult + "";
				DeleteFromArray(activeTerms, denominatorTerms[k].id);
			    DeleteFromArray(denominatorTerms, denominatorTerms[k].id);
			 }
			 else if ( ((denominatorTerms[j] != null) && (denominatorTerms[k] != null)) 
			    && IsANumber(denominatorTerms[j]) && IsANumber(denominatorTerms[k]))
			 {
			    var val1 = parseFloat(denominatorTerms[j].unevaluatedString);
				var val2 = parseFloat(denominatorTerms[k].unevaluatedString);
				
				var valResult = val1 * val2;
				denominatorTerms[j].unevaluatedString = "" + valResult + "";
				DeleteFromArray(activeTerms, denominatorTerms[k].id);
			    DeleteFromArray(denominatorTerms, denominatorTerms[k].id);			    
			 }
		  }
	   }
	   
	   for (var j = 0; j < numeratorTerms.length; j++)
	   {
	      for (var k = j+1; k < numeratorTerms.length; k++)
		  {
		     
		     if ( ((numeratorTerms[j] != null) && (numeratorTerms[k] != null)) && (numeratorTerms[j].unevaluatedString == numeratorTerms[k].unevaluatedString) &&
			      (IsANumber(numeratorTerms[j].exponent) && IsANumber(numeratorTerms[k].exponent)) )
			 {
			    var exp1 = parseFloat(numeratorTerms[j].exponent.unevaluatedString);
				var exp2 = parseFloat(numeratorTerms[k].exponent.unevaluatedString);
				
				var expResult = exp1 + exp2;
				numeratorTerms[j].exponent.unevaluatedString = "" + expResult + "";
				DeleteFromArray(activeTerms, numeratorTerms[k].id);
			    DeleteFromArray(numeratorTerms, numeratorTerms[k].id);
			 }
			 else if ( ((numeratorTerms[j] != null) && (numeratorTerms[k] != null)) && 
			    IsANumber(numeratorTerms[j]) && IsANumber(numeratorTerms[k]) )
			 {
			    var val1 = parseFloat(numeratorTerms[j].unevaluatedString);
				var val2 = parseFloat(numeratorTerms[k].unevaluatedString);
				
				var valResult = val1 * val2;
				numeratorTerms[j].unevaluatedString = "" + valResult + "";
				DeleteFromArray(activeTerms, numeratorTerms[k].id);
			    DeleteFromArray(numeratorTerms, numeratorTerms[k].id);			    
			 }			 
		  }
	   }
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
	   if (isNaN(parseFloat(termIn.unevaluatedString)) || termIn.terms.length > 1)
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
	   // update the terms in termIn (if they haven't been updated already)
	   if (termIn.terms.length == 0)
	   {
	      termIn.Evaluate(termIn.unevaluatedString);
	   }
	   
	   for (var i=0; i < termIn.terms.length; i++)
	   {
	      if (IsANumber(termIn.terms[i]))
		  {
		     break;
		  }
	   }
	   if (i < termIn.terms.length)
	   {
	      var originalValue = parseFloat(termIn.terms[i].unevaluatedString);
		  originalValue += constantIn;
		  termIn.terms[i].unevaluatedString = "" + originalValue + "";
	   }
	   else 
	   {
	      var myTerm = new CTerm("" + constantIn + "", "none", false);
		  termIn.terms[i-1].relationshipToNextTerm = "addition";
		  termIn.terms.push(myTerm);
	   }
	   
	   termIn.unevaluatedString = termIn.Unevaluate(termIn.terms);
	}
	
	////////////////////////////////////////////////////////////////////////////////////	
	
	function SubtractConstant(termIn, constantIn)
	{
	   // update the terms in termIn (if they haven't been updated already)
	   if (termIn.terms.length == 0)
	   {
	      termIn.Evaluate(termIn.unevaluatedString);
	   }
	   
	   for (var i=0; i < termIn.terms.length; i++)
	   {
	      if (IsANumber(termIn.terms[i]))
		  {
		     break;
		  }
	   }
	   if (i < termIn.terms.length)
	   {
	      var originalValue = parseFloat(termIn.terms[i].unevaluatedString);
		  originalValue -= constantIn;
		  termIn.terms[i].unevaluatedString = "" + originalValue + "";
	   }
	   else 
	   {
	      var myTerm = new CTerm("" + constantIn + "", "none", false);
		  termIn.terms[i-1].relationshipToNextTerm = "subtraction";
		  termIn.terms.push(myTerm);
	   }
	   
	   termIn.unevaluatedString = termIn.Unevaluate(termIn.terms);
	}	