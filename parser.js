    //////////////////////////////////////////////////////////////////
	//
	// Symbolic Math Library for Javascript
	//
	// (c) 2011 James McLellan
	//  
	// Permission granted to redistribute for both commercial and non-commercial purposes, provided
	// copyright information is retained.
	//
	//


	////////////////////////////////////////////////////////////////////////////////////
	
	function Unparse(termArray)
	{
	   var returnString = "";
	   
	   for (var i = 0; i < termArray.length; i++)
	   {
			 // :: TODO :: Finish this
			 if (termArray[i].isNegative)
			 {
			   returnString += "-";
			 }
			 if (termArray[i].multiplier != "1")
			 {
			   returnString += termArray[i].multiplier + "&dot;";
			 }
			 if (termArray[i].withRespectTo.length > 0)
			 {
			   returnString += "&part;";
			 }
			 
			 returnString += termArray[i].unevaluatedString;
			 
			 if (termArray[i].exponent.unevaluatedString != "1")
			 {
				returnString += "<sup>" + termArray[i].exponent.unevaluatedString + "</sup>";
			 }				 
			 
			 if (termArray[i].withRespectTo.length > 0)
			 {
			   // :TODO: Loop through multiple w.r.t entries
			   returnString += "/";
			   for (var j = 0; j < termArray[i].withRespectTo.length; j++)
			   {
			      returnString += "&part;" + termArray[i].withRespectTo[j];
			   }
			 }			 
			 if (termArray[i].relationshipToNextTerm == "addition")
			 {
			   returnString += "+";
			 }
			 if (termArray[i].relationshipToNextTerm == "subtraction")
			 {
			   returnString += "-";
			 }
			 if (termArray[i].relationshipToNextTerm == "multiply")
			 {
			   returnString += "&dot;";
			 }
			 if (termArray[i].relationshipToNextTerm == "divide")
			 {
			   returnString += "/";
			 }		 
			 
	   }
	   return returnString;
	}

	////////////////////////////////////////////////////////////////////////////////////
	
	function UnparseUnrelatedTerms(termArray)
	{
	   var returnString = "";
	   var exponentLatch = false;
	   
	   for (var i = 0; i < termArray.length; i++)
	   {
			 // :: TODO :: Finish this
			 //alert("Called UnparseUnrelated, this term = " + termArray[i].isMultiplicationTerm);
			 if (termArray[i].isNegative)
			 {
			   returnString += "-";
			 }
			 if (termArray[i].withRespectTo.length > 0)
			 {
			   returnString += "&part;";
			 }
			 if (termArray[i].isDivisionTerm == true)
			 {
			   returnString += "/";
			 }	
			 if (termArray[i].isMultiplicationTerm == true && (i > 0))
			 {
			   returnString += "&dot;";
			 }			 
			 
			 returnString += termArray[i].unevaluatedString;
			 
			 //if (exponentLatch)
			 //{
			//	returnString += "</sup>";
			//	exponentLatch = false;
			 //}
			 if (termArray[i].withRespectTo.length > 0)
			 {
			   // :TODO: Loop through multiple w.r.t entries
			   returnString += "/&part;" + termArray[i].withRespectTo[0];
			 }			 
			 //if (termArray[i].isAdditionTerm == true)
			 //{
			  // returnString += "+";
			 //}
			 //if (termArray[i].relationshipToNextTerm == "subtraction")
			 //{
			  // returnString += "-";
			 //}
			 //if (termArray[i].relationshipToNextTerm == "exponent")
			 //{
			//	returnString += "<sup>";
			//	exponentLatch = true;
			 //}			 
			 
	   }
	   return returnString;
	}

	////////////////////////////////////////////////////////////////////////////////////	
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function UnrelateTerms(termArray)
	{
	   // Most of the CTerm functions operate by assuming term 'A' is related to term 'B' 
	   //   is related to term 'C', and so on.
	   // For the sake of equivalent terms and other re-organization, unrelate terms so
	   //    that they can be parsed
	   
	   var returnValue = termArray
	   var exponentLatch = false;
	   
	   for (var i = 0; i < termArray.length-1; i++)
	   {
			 // :: TODO :: Finish this
			 //if (termArray[i].isNegative)
			 //{
			 //  returnString += "-";
			 //}
			 //if (termArray[i].withRespectTo.length > 0)
			 //{
			 //  returnString += "&part;";
			 //}
			 
			 //returnString += termArray[i].unevaluatedString;
			 
			 //if (exponentLatch)
			 //{
			//	returnString += "</sup>";
			//	exponentLatch = false;
			 //}
			 //if (termArray[i].withRespectTo.length > 0)
			 //{
			 //  // :TODO: Loop through multiple w.r.t entries
			 //  returnString += "/&part;" + termArray[i].withRespectTo[0];
			 //}			 
			 //if (termArray[i].relationshipToNextTerm == "addition")
			 //{
			 //  returnValue[i] = SetTermType(returnValue[i], "addition");
			 //  returnValue[i+1] = SetTermType(returnValue[i+1], "addition");
			 //}
			 //if (termArray[i].relationshipToNextTerm == "subtraction")
			 //{
			 //  returnValue[i+1].isSubtractionTerm = true;
			 //}
			 if (termArray[i].relationshipToNextTerm == "multiply")
			 {
			   //alert("Trying to add a multiply term");
			   if (i == 0)
			   {
			      returnValue[i] = SetTermType(returnValue[i], "multiply");			   
			   }
			   returnValue[i+1] = SetTermType(returnValue[i+1], "multiply");			   
			 }
			 if (termArray[i].relationshipToNextTerm == "divide")
			 {
			   //if (i == 0)
			   //{
			      returnValue[i] = SetTermType(returnValue[i], "multiply");			   
			   //}
			   returnValue[i+1] = SetTermType(returnValue[i+1], "divide");			   
			 }
			 //if (termArray[i].withRespectTo == "exponent")
			 //{
			//	returnString += "<sup>";
			//	exponentLatch = true;
			 //}			 
			 
	   }	
       return returnValue;	   
	}
	
	////////////////////////////////////////////////////////////////////////////////////

	function SetTermType(term, type)
	{
	
	  if (type == "addition")
	  {
	    term.isAdditionTerm = true;
		term.isSubtractionTerm = false;
		term.isMultiplicationTerm = false;
		term.isDivisionTerm = false;
	  }
	  if (type == "subtraction")
	  {
	    term.isAdditionTerm = false;
		term.isSubtractionTerm = true;
		term.isMultiplicationTerm = false;
		term.isDivisionTerm = false;	  
	  }
	  if (type == "multiply")
	  {
	    term.isAdditionTerm = false;
		term.isSubtractionTerm = false;
		term.isMultiplicationTerm = true;
		term.isDivisionTerm = false;	  
	  }
	  if (type == "divide")
	  {
	    term.isAdditionTerm = false;
		term.isSubtractionTerm = false;
		term.isMultiplicationTerm = false;
		term.isDivisionTerm = true;		  
	  }
	  
	  return term;
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
    function Parse(stringIn)
	{
	    var newStart = 0; // the start of the buffer
		this.buffer = ""; // buffer for processed characters; separating this from the input string allows additional manipulation to be performed on the buffer (such as skipping over tags)
		var nextTermIsNegative = false;
		this.waitingExponentFlag = false;
		this.waitingExponentBuffer = "";
		
		//alert("I have arrived for string " + stringIn);
	    for (var i = 0; i < stringIn.length; i++)
		{
		    //alert("Looking at char " + stringIn.charAt(i));
			
		    // Look for paren on this character
			if (IsParen(stringIn, i))
			{
			   //alert("IsParen");
			   // a. find the end of this paren group
			   var endOfParen = identifyNestedParen(stringIn, i);
			   // b. push the paren group onto the buffer
			   //    do not push the paren group onto the terms array
			   this.buffer += stringIn.substring(i+1, endOfParen + i);
			   //alert("Full paren found " + subTerm);
			   // c. skip i to the end of the paren group
			   i = i + endOfParen;
			   newStart = i + 1;
			   //alert("End of parent reached. Next character = '" + stringIn.charAt(i) + "'");
			}
			
			// Look for addition or subtraction
			if (IsAddSubtract(stringIn, i))
			{
			   //alert("IsAddSub");
			   // a. push the previous term onto the terms arry
			   //    i. set the previous term's "relationshipToNextTerm" to "addition" or "subtraction"
			   var lastEntry = 0;
			   if (this.terms.length != null)
			   {
			      lastEntry = this.terms.length;
			   }
			   var type = DetermineAddSubType(stringIn, i);
			   //    ii. set the next term's "relationshipToPreviousTerm" to "addition" or "subtraction"
			   //var subTerm = stringIn.substring(newStart, i );
			   if (this.buffer.length == 0)
			   {
			      // if a "+" or "-" was found, with no term preceding it, then the next term is a negative number
				  if (type=="addition")
				  {
				     nextTermIsNegative = false;
				  }
				  if (type=="subtraction")
				  {
				     nextTermIsNegative = true;
				  }				  
				  //alert("Next term will be negative : " + nextTermIsNegative);
			   } 
			   else 
			   {
			      var tempTerm = new CTerm(this.buffer, type, nextTermIsNegative); // create a new term using the string presently in the buffer
				  //alert("New term " + buffer + " type " + type + " negative " + nextTermIsNegative);
				  nextTermIsNegative = false;
				  
                  this.PushTerm(tempTerm);
			   }
			   //    iii. do not get the next term
			   //    iv. skip i to where the + or - was found
			   newStart = i + 1;
			}
			
			// Look for a partial differential
			if (IsDiff(stringIn, i))
			{
			    //alert("IsDiff of/wrt " + stringIn.charAt(i+6));
			    // a. look for the next term
				//   i. if the next term is a letter, add that letter to the "withRespectTo" array
				if (IsLetter(stringIn, i+6))
				{
				    //alert("Diff argument found");
					//      1. look to see if there is a paren next
					if (IsParen(stringIn, i+7))
					{
						//            (a) if there is, grab the whole term and push it onto the terms array				   
					    var endOfParen = identifyNestedParen(stringIn, i+7);
			            // b. push the paren group onto the terms array
			            var subTerm = stringIn.substring(i+8, endOfParen+i+7);
			            var tempTerm = new CTerm(subTerm);
						tempTerm.withRespectTo.push(stringIn.charAt(i+6));
			            this.terms.push(tempTerm);
						this.buffer = ""; // clear the buffer
						//alert("Clearing buffer in C");	
						newStart = i + 7 + endOfParen + 1;
						i = newStart;
					} 
					else if (IsDiv(stringIn, i+7))
					{
						//      2. look to see if there is a division sybol next
						//            (b) if there is, look to see if there's a partial differential term next
						var k = 0;
						var tempTerm = new CTerm(stringIn.charAt(i+6));							
						while (IsDiff(stringIn, i+8+k))
						{
							//                (i) look for multiple partial differentials; push each one onto the "withRespectTo" array
							tempTerm.withRespectTo.push(stringIn.charAt(i+8+k+6));
							//alert("Found partial term '" + stringIn.charAt(i+8+k+6) + "'");
							k = k+7;
							newStart = i+8+k;
							//i = newStart;
							//alert("Next term '" + stringIn.charAt(i+8+k) + "'");
						}
						i = newStart;
                        this.PushTerm(tempTerm);
						//alert("Clearing buffer in D");	
					}
					else
					{
					   newStart = i+7;
					   i = newStart;
					}
				}
			}
			
			// Look for an exponent
			if (IsExponent(stringIn, i))
			{
			   //alert("IsExp");
			   i = i+5;
			   // a. find the end of this paren group
			   var endOfExponent = identifyEndOfExponent(stringIn, i);
			   this.waitingExponentFlag = true;
			   this.waitingExponentBuffer += stringIn.substring(i, endOfExponent);
			   // c. skip i to the end of the paren group
			   newStart = endOfExponent + 6;
			   i = newStart - 1;
			}
			
			//if (IsExponentEnd(stringIn, i))
			//{
			  // if this is the closing part of an exponent, advance past it
			  //newStart = i+6;
              //i = i+5
			//}
			
			// Look for multiplication or division
			if (IsMultiplicationDivision(stringIn, i))
			{
			   //alert("IsMult");
			   // a. push the previous term onto the terms arry
			   //    i. set the previous term's "relationshipToNextTerm" to "multiplication" or "division"
			   var lastEntry = 0;
			   if (this.terms.length != null)
			   {
			      lastEntry = this.terms.length;
			   }
			   var type = DetermineMulDivType(stringIn, i);
			   //    ii. set the next term's "relationshipToPreviousTerm" to "multiplication" or "division"
			   //var subTerm = stringIn.substring(newStart, i );
			   var tempTerm = new CTerm(this.buffer, type, nextTermIsNegative);
			   nextTermIsNegative = false;
               this.PushTerm(tempTerm);
			   //    iii. do not get the next term
			   //    iv. skip i to where the * or / was found
			   if (type == "multiply") 
			   {
			      newStart = i + 5;
				  i = newStart;
			   }
			   else
			   {
			      newStart = i + 1;
			   }
			}
			
			// Look for a trig function
			if (IsTrigFunction(stringIn, i))
			{
			   // do nothing yet
			}
			
			if (i <= stringIn.length && i >= newStart) 
			{
			   this.buffer += stringIn.charAt(i);
			   //alert("Creating new term '" + buffer + "'");			   
			}
		}
		// at the end of the process, take any trailing data without operators and push as a term
	    //var subTerm = stringIn.substring(newStart, i );
		//alert("End of String. Last term start " + newStart + ", end " + i + ". Value = " + subTerm);
		//alert("End of String. Buffer = '" + buffer + "'.");
		if (this.buffer.length > 0) {
	       var tempTerm = new CTerm(this.buffer, "none", nextTermIsNegative);
            this.PushTerm(tempTerm);
		}
		
		var tempString = Unparse(this.terms);
		if (tempString != this.unevaluatedString)
		{
		  // alert ("PARSE REDUNDANCY CHECK ERROR: Unparse returned " + tempString + " after parsing input " + this.unevaluatedString);
		}
	}

	////////////////////////////////////////////////////////////////////////////////////
	
	  function PushTermFromBuffer(termIn) {
		  this.buffer = ""; // clear the buffer
		  if (this.waitingExponentFlag == true)
		  {
				this.waitingExponentFlag = false;
				var exponentTerm = new CTermNoExponent( this.waitingExponentBuffer );
				termIn.exponent = exponentTerm;
				this.waitingExponentBuffer = "";
		  }				  
		  this.terms.push(termIn);
	  }	
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function IsLetter(stringIn, i)
	{
	   var testChar = stringIn.charAt(i);
	   if (testChar.match(/[a-zA-Z]/) != null)
	   {
	      return true;
	   } 
	   else
	   {
	      return false;
	   }
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function IsTrigFunction(stringIn, i)
	{
	   return false;
	}

	////////////////////////////////////////////////////////////////////////////////////
	
	function DetermineMulDivType(stringIn, i)
	{
	   if ((stringIn.charAt(i) == "&") && 
	      (stringIn.charAt(i+1) == "d") &&
		  (stringIn.charAt(i+2) == "o") &&
		  (stringIn.charAt(i+3) == "t") &&
		  (stringIn.charAt(i+4) == ";") )
        {
		   return "multiply";
        }		
		if (stringIn.charAt(i) == "/")
		{
		  return "divide";
		}
		return false;
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function IsMultiplicationDivision(stringIn, i)
	{
	   //alert("Checking for mult/div, starting char = " + stringIn.charAt(i));
	   if ((stringIn.charAt(i) == "&") && 
	      (stringIn.charAt(i+1) == "d") &&
		  (stringIn.charAt(i+2) == "o") &&
		  (stringIn.charAt(i+3) == "t") &&
		  (stringIn.charAt(i+4) == ";") )
        {
		   return true;
        }		
		if (stringIn.charAt(i) == "/")
		{
		  return true;
		}
		return false;
	}

	////////////////////////////////////////////////////////////////////////////////////
	
	function DetermineAddSubType(stringIn, i)
	{
	   if (stringIn.charAt(i) == "+") 
	   {
	      return("addition");
	   }
	   
	   if (stringIn.charAt(i) == "-")
	   {
		   return("subtraction");
	   }
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function IsAddSubtract(stringIn, i)
	{
	   if ((stringIn.charAt(i) == "+") ||
	       (stringIn.charAt(i) == "-") )
		{
		   return true;
		}
		else
		{
		   return false;
		}
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function IsExponent(stringIn, i)
	{
	   if ((stringIn.charAt(i) == "<") && 
	      (stringIn.charAt(i+1) == "s") &&
		  (stringIn.charAt(i+2) == "u") &&
		  (stringIn.charAt(i+3) == "p") &&
		  (stringIn.charAt(i+4) == ">") )
	   {
	      return true;
	   }
	   else
	   {
	      return false;
	   }	
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function IsExponentEnd(stringIn, i)
	{
	   if ((stringIn.charAt(i) == "<") && 
	      (stringIn.charAt(i+1) == "/") &&
		  (stringIn.charAt(i+2) == "s") &&
		  (stringIn.charAt(i+3) == "u") &&
		  (stringIn.charAt(i+4) == "p") &&
		  (stringIn.charAt(i+5) == ">") )
	   {
	      return true;
	   }
	   else
	   {
	      return false;
	   }	
	}	
	
	////////////////////////////////////////////////////////////////////////////////////
	
    function identifyExpEnd(stringIn, i)
    {
	   var j = 0; // loop counter
	   for (j = 0; j < (stringIn.length - i); j++)
	   {
	      if ((stringIn.charAt(i) == "<") && 
		     (stringIn.charAt(i+1) == "/") &&
	         (stringIn.charAt(i+2) == "s") &&
		     (stringIn.charAt(i+3) == "u") &&
		     (stringIn.charAt(i+4) == "p") &&
		     (stringIn.charAt(i+5) == ">") )
		  {
		     break;
		  }
	   }
	   return(j);
    }		
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function IsDiff(stringIn, i)
	{
	   if (stringIn.charAt(i) == "&" && 
	      (stringIn.charAt(i+1) == "p") &&
		  (stringIn.charAt(i+2) == "a") &&
		  (stringIn.charAt(i+3) == "r") &&
		  (stringIn.charAt(i+4) == "t") &&
		  (stringIn.charAt(i+5) == ";") )
	   {
	      return true;
	   }
	   else
	   {
	      return false;
	   }
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function IsDiv(stringIn, i)
	{
	   if (stringIn.charAt(i) == "/")
	   {
	      return true;
	   }
	   else
	   {
	      return false;
	   }
	}	
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function IsParen(stringIn, i)
	{
	   if (stringIn.charAt(i) == "(")
	   {
	      return true;
	   }
	   else
	   {
	      return false;
	   }
	}
	
	////////////////////////////////////////////////////////////////////////////////////
 
    function identifyNestedParen(stringIn, i)
    {
	   // stringIn should be a token that begins with the paren; 
	   //  this will count open and closing pares until zero is reached and return the substring begining and end for slicing
	   var parenCount = 0;
	   var j = 0; // loop counter
	   for (j = 0; j < (stringIn.length - i); j++)
	   {
	      if (stringIn.charAt(i + j) == '(')
		  {
		     parenCount++;
		  } 
		  if (stringIn.charAt(i + j) == ')')
		  {
		     parenCount--;
		  }
		  if (parenCount == 0)
		  {
		     break;
		  }
	   }
	   return(j);
    }
	
	////////////////////////////////////////////////////////////////////////////////////
 
    function identifyEndOfExponent(stringIn, i)
    {
	   var j = i; // loop counter
	   for (j = i; j < (stringIn.length); j++)
	   {
	      if (IsExponentEnd(stringIn, j))
		  {
		     break;
		  }
	   }
	   return(j);
    }	