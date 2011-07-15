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
 
    function CTerm(termString)
	{
	   //alert("Creating term " + termString);
	   this.id = GenerateNewID(globalIDCounter);
	   this.relationshipToPreviousTerm = "";
	   this.relationshipToNextTerm = "";
	   this.operation = "";
	   this.withRespectTo = new Array();
	   this.terms = new Array();
	   //this.terms[0] = []; // the 0-row of the terms array is the current (unexpanded) level
	   this.Evaluate = Parse;
	   this.Simplify = SimplifyTerms;
	   this.unevaluatedString = termString;
	   //this.Evaluate(termString);
	   this.isNegative = false;
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
    function CTerm(termString, typeString)
	{
	   //alert("Creating term " + termString);
	   this.id = GenerateNewID(globalIDCounter);	   
	   this.relationshipToPreviousTerm = "";
	   this.relationshipToNextTerm = typeString;
	   this.operation = "";
	   this.withRespectTo = new Array();
	   this.terms = new Array();
	   //this.terms[0] = []; // the 0-row of the terms array is the current (unexpanded) level
	   this.Evaluate = Parse;
	   this.Simplify = SimplifyTerms;
	   this.unevaluatedString = termString;
	   //this.Evaluate(termString);
	   this.isNegative = false;
	}	
	
	////////////////////////////////////////////////////////////////////////////////////
	
    function CTerm(termString, typeString, isNegative)
	{
	   //alert("Creating term " + termString);
	   this.id = GenerateNewID(globalIDCounter);	   
	   this.relationshipToPreviousTerm = "";
	   this.relationshipToNextTerm = typeString;
	   this.operation = "";
	   this.withRespectTo = new Array();
	   this.terms = new Array();
	   //this.terms[0] = []; // the 0-row of the terms array is the current (unexpanded) level
	   this.Evaluate = Parse;
	   this.Simplify = SimplifyTerms;
	   this.unevaluatedString = termString;
	   //this.Evaluate(termString);
	   this.isNegative = isNegative;
	}	