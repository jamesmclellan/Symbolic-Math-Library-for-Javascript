	function PerformPartialDifferential(termInput, withRespectTo)
	{
	   // This function will loop through all the components of this.terms[] and do the following:
	   //  . Will create "equivalentExpressions" reflecting the associative properties of multiplied terms
	   //  . If there are negating terms, (e.g. A - A) will remove them
	   //  . If there are addable terms, (e.g. A + A), will add them (2A)
	   
	   //alert ("Simplify called");
	   var activeTerms = []; // the array of terms to be operated on
	   var simplifiedTermsA = []; // the array of results -- final, simplified terms
	   var simplifiedTermsB = []; // the array of results -- final, simplified terms
	   var step3Terms = []; // term results of multiplication/division
	   var step4Terms = []; // term results of addition/subtraction
	   var finalTerms = [];
	   var bMultiplyDivideLatch = false;
	   
	   //
	   // :TODO: If an addition/subtraction operation occurs between multiply/division operations, preserve the +/-
	   //
	   
	   for (var i = 0; i < termInput.terms.length; i++)
	   {
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
			   simplifiedTermsA = activeTerms;
			   if (activeTerms.length == 1)
			   {
                  simplifiedTermsB = PerformSimplePartialDifferential(simplifiedTermsA);
			   }
			   else
			   {
			      // use product rule (fg)' = f'g + fg'... 
			      for (var j=0; j < simplifiedTermsA.length; j++)
				  {
				     for (var k=0; k < simplifiedTermsA.length; k++)
					 {
					    var myTerm = new CTerm("");
						simplifiedTermsA[k].Copy(myTerm);
						if (j==k)
						{
						   var retValues = PerformSimplePartialDifferential( myTerm, withRespectTo );
						   for (var m = 0; m < retValues.length; m++)
						   {
							  simplifiedTermsB.push(retValues[m]);
							  simplifiedTermsB[simplifiedTermsB.length-1].relationshipToNextTerm = "multiply";
						   }						
						}
						else
						{
						   simplifiedTermsB.push(myTerm);
						   simplifiedTermsB[simplifiedTermsB.length-1].relationshipToNextTerm = "multiply";
						}
					 }
					 // change the term type of the last to addition
					 simplifiedTermsB[simplifiedTermsB.length-1].relationshipToNextTerm = "addition";
				  }
			   }
			   // copy the results of the simplification to a new CTerm
	           var myTerm = new CTerm("", nextTermType, false);
   	           myTerm.terms = simplifiedTermsB;
	           myTerm.unevaluatedString = Unparse(myTerm.terms, true); // bubble all terms to the top
			   myTerm.terms = [];
			   myTerm.Evaluate(myTerm.unevaluatedString); // re-chunk the terms, so that simplify will work
	           myTerm.isNegative = DetermineSign(myTerm.terms);
	   
			   var resultTerm = new CTerm("");
	           resultTerm = SimplifyTerms(myTerm);
			   for (var k = 0; k < resultTerm.terms.length; k++)
			   {
			      step3Terms.push(resultTerm.terms[k]);		
			   }
			   activeTerms = []; 
			   bMultiplyDivideLatch = false;			   
			}
			// if we've come to the end of a string of multiplication/division operators, then it is time to work on
			//    the given string/array, then reset for the next possible string
			else if (!bMultiplyDivideLatch)
			{
			   var retValues = PerformSimplePartialDifferential( termInput.terms[i], withRespectTo );
			   for (var k = 0; k < retValues.length; k++)
		       {
		          step3Terms.push(retValues[k]);
		       }
			} // end of multiplication-division handling subsection
	   } // done with term loop
	   
	   
	   // 4. handle addition/subtraction
	   step4Terms = step3Terms;

	   return step4Terms;	
	}
	
   //////////////////////////////////////////////////////////////////////

   function PerformSimplePartialDifferential(termInput, withRespectTo)
   {
      // assumes only one term
      var expValue = parseFloat(termInput.exponent.unevaluatedString);
	  var mulValue = parseFloat(termInput.multiplier);
	  var root = termInput.unevaluatedString;
	  var resultTerm = [];
	  
	  expValue -= 1;
	  
	  if (expValue == 0 && (termInput.unevaluatedString == withRespectTo))
	  {
	     var myTerm = new CTerm("1");
		 resultTerm.push(myTerm);
	  }	  
	  else if ( IsANumber(termInput) )
	  {
	 	 var myTerm = new CTerm("0");
		 resultTerm.push(myTerm); 
	  }
	  else if ( (expValue > 0) || (expValue < 0) )
	  {
	     mulValue *= (expValue + 1);
		 termInput.multiplier = "" + mulValue + "";
		 termInput.exponent.unevaluatedString = "" + expValue + "";
		 var tmpTerm =  new CTerm( "&part;" + root + "/&part;" + withRespectTo );
		 //tmpTerm.withRespectTo.push(withRespectTo);
		 //tmpTerm.unevaluatedString = Unparse(tmpTerm.terms);
		 tmpTerm.relationshipToNextTerm = termInput.relationshipToNextTerm;
		 termInput.relationshipToNextTerm = "multiply";
         resultTerm.push(termInput);		 
		 resultTerm.push(tmpTerm);
	  } else {
	     termInput.withRespectTo.push(withRespectTo);
	     resultTerm.push(termInput);
	  }
	  
	  return resultTerm;
   }