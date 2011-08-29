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
	
	function Unparse(termArray, suppressMinusSigns)
	{
	   var returnString = "";
	   
	   for (var i = 0; i < termArray.length; i++)
	   {
			 // :: TODO :: Finish this
			 if (termArray[i].isNegative && !suppressMinusSigns)
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
			 if (termArray[i].isParenthetical)
			 {
			   returnString += "(";
			 }			 
			 
			 
			 returnString += termArray[i].unevaluatedString;

			 if (termArray[i].isParenthetical)
			 {
			   returnString += ")";
			 }			 		
			 
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
//			 if (termArray[i].isNegative)
//			 {
//			   returnString += "-";
//			 }
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
	
	function ParseParen(stringIn, startIdx, bufferRef)
	{
	    // Takes in a string argument and an index into that string
		//   returns the last character (closing paren) for that string
		//
		// Also takes an optional reference "bufferRef". If present, places the
		//    buffer value in the bufferRef, rather than the default buffer
		//
		
		// Look for paren on this character
		if (IsParen(stringIn, startIdx))
		{
		   // a. find the end of this paren group
		   var endOfParen = identifyNestedParen(stringIn, startIdx);
		   // b. push the paren group onto the buffer
		   //    do not push the paren group onto the terms array
		   if (typeof(bufferRef)=="undefined")
		   {
			   this.buffer += stringIn.substring(startIdx+1, endOfParen + startIdx);
			   this.nextTermIsParenthetical = true;		   
		   } 
		   else
		   {
		      bufferRef.buffer = stringIn.substring(startIdx+1, endOfParen + startIdx);
		   }
		   
		   var returnValue = startIdx + endOfParen;
		   return(returnValue);
		}
		else 
		{
		   return startIdx;
		}
	}

	////////////////////////////////////////////////////////////////////////////////////
	
	function BufferObject()
	{
	   this.buffer = "";
	}

	////////////////////////////////////////////////////////////////////////////////////	
	
	function TokenObject()
	{
	   this.buffer = "";
	   this.endDelimiter = -1;
	   this.beginDelimiter = -1;
	   this.beginToken = -1; // normally this would be equal to endDelimiter + 1
	   this.endToken = -1;
	}
	
	////////////////////////////////////////////////////////////////////////////////////	
	
	function ParseDifferential(stringIn, i)
	{
			var diffSymbol = "&part;";
		    var diffSymbolLength = diffSymbol.length;
	        var returnValue = "";
			
			// Look for a partial differential
			if (IsDiff(stringIn, i))
			{
			    //
				// Types to Handle:
				// --------------------------------
				// 
				// &part;x(A) <-- letter after "&part;"
				//             -- then paren
				// &part;x&part;x[...](A) <-- letter after "&part;"
				//                         -- then part (repeated)
				// &part;x&part;y[...](A) <-- letter after "&part;"
				//                         -- then part (repeated)				
				// &part;A/&part;x&part;x[...] <-- letter after "&part;"
				//                              -- then "/"				
				// &part;A/&part;x&part;y[...] <-- letter after "&part;"
				//                              -- then "/"
				// &part;(A)/&part;x
				// &part;(A)/&part;x&part;x[...]
				// &part;(A)/&part;x&part;y[...]
				
			
			    // a. look for the next term
				//   i. if the next term is a letter, add that letter to the "withRespectTo" array
				if (IsLetter(stringIn, i + diffSymbolLength))
				{
					//      1. look to see if there is a paren next
					var diffLocationAfterLetter = i + diffSymbolLength + 1; // possible parenthesis start location
					
					//
					// Pattern looking for is 
					//
					
					if (IsParen(stringIn, diffLocationAfterLetter))
					{
					    //
					    // This section of code looks for a partial differential in the form: "&part;x(A)"				
						//
			            var subTerm = new BufferObject();
                        var endParen = ParseParen(stringIn, i + diffSymbolLength, subTerm);					
			            var tempTerm = new CTerm(subTerm.buffer); 
						tempTerm.withRespectTo.push(stringIn.charAt(i+diffSymbolLength));
						this.PushTerm(tempTerm);
						
						returnValue = endOfParen + 1;
						return(returnValue);
					}
					else if (IsDiv(stringIn, i + diffSymbolLength + 1))
					{
						//      2. look to see if there is a division sybol next
						//            (b) if there is, look to see if there's a partial differential term next
						
						//
						// This section of code looks for a partial differential in the form: "&part;A/&part;x"
						//
						var k = 0;
						var afterDivLocation = i + diffSymbolLength + 2;
						var tempTerm = new CTerm(stringIn.charAt(i + diffSymbolLength)); // get the root "A"
						while (IsDiff(stringIn, afterDivLocation + k))
						{
							//                (i) look for multiple partial differentials; push each one onto the "withRespectTo" array
							tempTerm.withRespectTo.push(stringIn.charAt(afterDivLocation + k + diffSymbolLength));
							k = k + diffSymbolLength + 1;
						}
                        this.PushTerm(tempTerm);						
						returnValue = afterDivLocation + k; 
						return(returnValue);
					}
					else
					{
//					   newStart = i+7;
//					   i = newStart;
					}
				}
				else
				{
				}
			}	
			else
			{
			  return(i);
			}
	
	}

	////////////////////////////////////////////////////////////////////////////////////	
	
	function ParseAddSubtract(stringIn, i)
	{
		if (IsAddSubtract(stringIn, i))
		{
		   // a. push the previous term onto the terms arry
		   //    i. set the previous term's "relationshipToNextTerm" to "addition" or "subtraction"
		   var type = DetermineAddSubType(stringIn, i);
		   //    ii. set the next term's "relationshipToPreviousTerm" to "addition" or "subtraction"
		   if (this.buffer.length == 0)
		   {
			  // if a "+" or "-" was found, with no term preceding it, then the next term is a negative number
			  if (type=="addition")
			  {
				 this.nextTermIsNegative = false;
			  }
			  if (type=="subtraction")
			  {
				 this.nextTermIsNegative = true;
			  }				  
		   } 
		   else 
		   {
			  var tempTerm = new CTerm(this.buffer, type, this.nextTermIsNegative); // create a new term using the string presently in the buffer
			  tempTerm.isParenthetical = this.nextTermIsParenthetical;
			  this.nextTermIsNegative = false;
			  this.nextTermIsParenthetical = false;
			  
			  this.PushTerm(tempTerm);
		   }
		   //    iii. do not get the next term
		   //    iv. skip i to where the + or - was found
		   return(i + 1);
		}
		else
		{
		  return(i);
		}
	}

	////////////////////////////////////////////////////////////////////////////////////	

    function ParseExponent(stringIn, i)
    {
	    var returnValue = 0;
		var startExpSymbol = "<sup>";
		var endExpSymbol = "</sup>";
		var lengthStartExpSymbol = startExpSymbol.length;
		var lengthEndExpSymbol = endExpSymbol.length;
		
		if (IsExponent(stringIn, i))
		{
		   i = i + lengthStartExpSymbol;
		   // a. find the end of this paren group
		   var endOfExponent = identifyEndOfExponent(stringIn, i);
		   this.waitingExponentFlag = true;
		   this.waitingExponentBuffer += stringIn.substring(i, endOfExponent);
		   // c. skip i to the end of the paren group
		   returnValue = endOfExponent + 6;
		   return(returnValue - 1);
		}
		else
		{
		   return(i);
		}	
    }	
	
	////////////////////////////////////////////////////////////////////////////////////	

    function ParseMultiplicationDivision(stringIn, i)
    {
	    var returnValue = 0;
		var multiplySymbol = "&dot;";
		var multiplySymbolLength = multiplySymbol.length;		
		
		if (IsMultiplicationDivision(stringIn, i))
		{
		   // a. push the previous term onto the terms arry
		   //    i. set the previous term's "relationshipToNextTerm" to "multiplication" or "division"
		   var type = DetermineMulDivType(stringIn, i);
		   //    ii. set the next term's "relationshipToPreviousTerm" to "multiplication" or "division"
		   //var subTerm = stringIn.substring(newStart, i );
		   var tempTerm = new CTerm(this.buffer, type, this.nextTermIsNegative);
		   tempTerm.isParenthetical = this.nextTermIsParenthetical;
		   this.nextTermIsNegative = false;
		   this.nextTermIsParenthetical = false;
		   this.PushTerm(tempTerm);
		   //    iii. do not get the next term
		   //    iv. skip i to where the * or / was found
		   if (type == "multiply") 
		   {
			  returnValue = i + multiplySymbolLength;
		   }
		   else
		   {
			  returnValue = i + 1;
		   }
		   return(returnValue);
		}	
		else
		{
		   return(i)
		}
    }	
	
	////////////////////////////////////////////////////////////////////////////////////	
	
    function Parse(stringIn)
	{
	    var newStart = 0; // the start of the buffer
		this.buffer = ""; // buffer for processed characters; separating this from the input string allows additional manipulation to be performed on the buffer (such as skipping over tags)
		this.nextTermIsNegative = false;
		this.nextTermIsParenthetical = false;
		this.waitingExponentFlag = false;
		this.waitingExponentBuffer = "";		
		var thisPass = 0; // a dirty flag
		
	    for (var i = 0; i < stringIn.length; i++)
		{
		    thisPass = i;
			
			// parse any parenthetical, and change the index
			i = this.ParsePar(stringIn, i);
			if (i != thisPass) continue;
			
			// look for addition or subtraction			
			i = this.ParseAdd(stringIn, i);
			if (i != thisPass) {
			   i = i - 1; // ParseAddSubtract() only increments to dirty the index; the continue will take care of the real incrementing
			   continue;
			}
			
			// look for a differential
			i = this.ParseDiff(stringIn, i);
			if (i != thisPass) continue;
				
			// Look for an exponent
            i = this.ParseExp(stringIn, i);
			if (i != thisPass) continue;
			
			// Look for multiplication or division
            i = this.ParseMul(stringIn, i);
			if (i != thisPass) {
			   i = i -1;
			   continue;
			}
			
			// Look for a trig function
			if (IsTrigFunction(stringIn, i))
			{
			   // do nothing yet
			}
			
			if (i <= stringIn.length && i >= newStart) 
			{
			   this.buffer += stringIn.charAt(i);	   
			}
		}
		
		// at the end of the process, take any trailing data without operators and push as a term
		if (this.buffer.length > 0) {
	       var tempTerm = new CTerm(this.buffer, "none", this.nextTermIsNegative);
		   tempTerm.isParenthetical = this.nextTermIsParenthetical;
           this.PushTerm(tempTerm);
		}
		
		var tempString = Unparse(this.terms, false);
		if (tempString != this.unevaluatedString)
		{
		   alert ("PARSE REDUNDANCY CHECK ERROR: Unparse returned " + tempString + " after parsing input " + this.unevaluatedString);
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