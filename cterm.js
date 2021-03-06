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


	var globalIDCounter = 1;
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function GenerateNewID(globalIDSource)
	{
	   // :TODO: Passing in globalIDSource does not actually increment the global variable referenced.
	   //        Using global variable directly as a work-around, but should implement
	   //        a different fix later.
	   
	   // increment the counter
	   globalIDCounter++;
	   //alert("GlobID now equals " + globalIDCounter);
	   
	   // return the value
	   return globalIDCounter;
	}
	
	////////////////////////////////////////////////////////////////////////////////////
 
    function CTermNoExponent(termString)
	{
	   //alert("Creating term " + termString);
	   this.id = GenerateNewID(globalIDCounter);
	   this.relationshipToPreviousTerm = "";
	   this.relationshipToNextTerm = "none";
	   this.operation = "";
	   this.withRespectTo = new Array(); 
	   this.terms = new Array(); // the decomposed terms of the unevaluatedString for this term
	   //this.terms[0] = []; // the 0-row of the terms array is the current (unexpanded) level
	   this.Evaluate = Parse;
	   this.Unevaluate = Unparse;
	   this.Simplify = SimplifyTerms;
	   this.unevaluatedString = termString; // the string meaning of this term
	   this.equivalentTerms = new Array(); // array of variations to the unevaluatedString that are equal in meaning
	   //this.Evaluate(termString);
	   this.isNegative = false;
	   this.multiplier = "1"; // treat as a string since a non-numeric term could possibly end up here
	   this.exponent = "1";	 // treat as a string since a non-numeric term could possibly end up here
	   
	   // private methods
	   this.PushTerm = PushTermFromBuffer;
	   this.ParseAdd = ParseAddSubtract;
	   this.ParseMul = ParseMultiplicationDivision;
	   this.ParsePar = ParseParen;
	   this.ParseDiff = ParseDifferential;
	   this.ParseExp = ParseExponent;
	   this.Copy = CopyCTermNoExponent;
	}	
	
	////////////////////////////////////////////////////////////////////////////////////
	
    function CTerm(termString, typeString, isNegative, exponentValue)
	{
	   //alert("Creating term " + termString);
	   this.id = GenerateNewID(globalIDCounter);	   
	   this.relationshipToPreviousTerm = "";
	   if (typeof(typeString) == "undefined")
	   {
	      this.relationshipToNextTerm = "none";
	   }
	   else
	   {
	      this.relationshipToNextTerm = typeString;
	   }
	   this.operation = "";
	   this.withRespectTo = new Array();
	   this.terms = new Array();
	   //this.terms[0] = []; // the 0-row of the terms array is the current (unexpanded) level
	   this.Evaluate = Parse;
	   this.Unevaluate = Unparse;
	   this.Simplify = SimplifyTerms;
	   this.unevaluatedString = termString;
	   this.equivalentTerms = new Array(); // array of variations to the unevaluatedString that are equal in meaning
	   //this.Evaluate(termString);
	   if (typeof(isNegative) == "undefined")
	   {
	      this.isNegative = false;
	   }
	   else
	   {
	      this.isNegative = isNegative;
	   }
	   this.multiplier = "1"; // treat as a string since a non-numeric term could possibly end up here
	   this.isParenthetical = false;
	   
	   if (typeof(exponentValue) == "undefined")
	   {
 	      this.exponent = new CTermNoExponent("1");	 // treat as a string since a non-numeric term could possibly end up here	   
	   }
	   else
	   {
	      this.exponent = new CTermNoExponent(exponentValue);
	   }
	   
	   // private methods
	   this.PushTerm = PushTermFromBuffer;
	   this.ParseAdd = ParseAddSubtract;
	   this.ParseMul = ParseMultiplicationDivision;
	   this.ParsePar = ParseParen;
	   this.ParseDiff = ParseDifferential;
	   this.ParseExp = ParseExponent; 
	   this.Copy = CopyCTerm;
	}	
	
	////////////////////////////////////////////////////////////////////////////////////

    function CopyCTerm(destination)
    {
       var returnValue = destination;
	   
	   returnValue.relationshipToPreviousTerm = this.relationshipToPreviousTerm;
	   returnValue.relationshipToNextTerm = this.relationshipToNextTerm;
	   returnValue.operation = this.operation;
	   for (var i = 0; i < this.withRespectTo.length; i++)
	   {
	      returnValue.withRespectTo.push(this.withRespectTo[i]);
	   }
	   
	   for (i = 0; i < this.terms.length; i++)
	   {
	      returnValue.terms.push(this.terms[i].Copy());
	   }

	   for (i = 0; i < this.equivalentTerms.length; i++)
	   {
	      returnValue.equivalentTerms.push(this.equivalentTerms[i].Copy());
	   }

	   returnValue.unevaluatedString = this.unevaluatedString;
	   returnValue.isNegative = this.isNegative;

	   returnValue.multiplier = this.multiplier;
	   returnValue.isParenthetical = this.isParenthetical;
	         
 	   this.exponent.Copy(returnValue.exponent);
	   
    }	
	
	////////////////////////////////////////////////////////////////////////////////////

    function CopyCTermNoExponent(destination)
    {
       var returnValue = destination;
	   
	   returnValue.relationshipToPreviousTerm = this.relationshipToPreviousTerm;
	   returnValue.relationshipToNextTerm = this.relationshipToNextTerm;
	   returnValue.operation = this.operation;
	   for (var i = 0; i < this.withRespectTo.length; i++)
	   {
	      returnValue.withRespectTo.push(this.withRespectTo[i]);
	   }
	   
	   for (i = 0; i < this.terms.length; i++)
	   {
	      returnValue.terms.push(this.terms[i].Copy());
	   }

	   for (i = 0; i < this.equivalentTerms.length; i++)
	   {
	      returnValue.equivalentTerms.push(this.equivalentTerms[i].Copy());
	   }

	   returnValue.unevaluatedString = this.unevaluatedString;
	   returnValue.isNegative = this.isNegative;

	   returnValue.multiplier = this.multiplier;
	   returnValue.isParenthetical = this.isParenthetical;
	   
	   returnValue.exponent = this.exponent;
	   
    }		