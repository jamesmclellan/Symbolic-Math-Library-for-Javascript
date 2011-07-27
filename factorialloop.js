
	
	////////////////////////////////////////////////////////////////////////////////////	
	
	// FactorialLoop
	//
	// Arguments
	//    numItems - the upper limit of this factorial loop, i.e. 6!, 5!, etc.
	//    functionToPerform - this is the function that will be performed on the deepest level of this loop
	//        any arguments to this function should be secured as attributes to the function object before it is
	//        passed in. The function should accept a single indexArray argument which is the array of the 
	//        factorial indices.
	// Returns
	//    nothing - a return value should be kept inside the "functionToPerform" object/function
	//
	function FactorialLoop(numItems, functionToPerform)
	{
	   // create an array indices[numItems]
	   var indices = new Array(numItems);
	   var indexBounds = new Array(numItems)
	   
	   // initialize indexBounds[0] = 1, 2, 3, 4, .. numItems
	   InitializeIntegerArray(indexBounds);
	   //alert("Factorial loop has " + indices.length + " levels. Top-most level indices are " + PrintArray(indexBounds[0]));
	   
	   // loop through all of indices[0] elements
	   for (var i = 0; i < indexBounds[0].length; i++)
	   {
	      indices[0] = indexBounds[0][i];
	      ReEntrantLoop(indices, indexBounds, 0, i, functionToPerform);
	   }
	}

	////////////////////////////////////////////////////////////////////////////////////	
	
	function PrintArray(inputArray)
	{
	  var returnValue = "";
	  //alert("Print Array called with " + inputArray.length + " terms to print");
	  for (var i = 0 ; i < inputArray.length; i++)
	  {
	     returnValue += " " + inputArray[i];
	  }
	  return returnValue;
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	function ReEntrantLoop(indexArray, indexBoundsArray, currentLevel, index, functionToPerform)
	{
	  // we started at the previous level, increment to the new level
	  currentLevel++;
	  
	  // determine the index bounds for this level
	  // create a list of excluded indices from the currently selected indices and the current level
	  var exclusionArray = InitializeExclusionArray(indexArray, currentLevel);
	  
	  // create the index bounds array, which is a subset of the largest index bounds array (i.e. the first one) excluding the current indices
	  indexBoundsArray[currentLevel] = AddExcluding(indexBoundsArray[0], exclusionArray);
	  //alert("Index bounds for level " + currentLevel + " has " + indexBoundsArray[currentLevel].length + " terms. Values " + PrintArray(indexBoundsArray[currentLevel]));
	  
	  // loop through the index bounds
	  for (var i = 0; i < indexBoundsArray[currentLevel].length; i++)
	  {
	     indexArray[currentLevel] = indexBoundsArray[currentLevel][i];
		 
		 if (currentLevel < (indexArray.length - 1))
		 {
		    //alert("Entering re-entrant loop, current level " + currentLevel);
		    ReEntrantLoop(indexArray, indexBoundsArray, currentLevel, index, functionToPerform);
		 }
		 else
		 {
		    //alert("Performing re-entrant loop function");
		    functionToPerform.functionToCall(indexArray);
		 }
	  }
	}

	////////////////////////////////////////////////////////////////////////////////////
	
	function InitializeExclusionArray(indexArray, level)
	{
	  var returnValue = [];
	  
	  // loop through the levels, getting the current 
	  for (var i = 0; i < level; i++)
	  {
	     returnValue.push(indexArray[i]);
		 //alert("Exclusion term " + indexArray[i]);
	  }
	  
	  return returnValue;
	}

	////////////////////////////////////////////////////////////////////////////////////
	
    function InitializeIntegerArray(inputArray)
    {
	   for (var i = 0; i < inputArray.length; i++)
	   {
	     inputArray[i] = new Array(inputArray.length - i);
		 //alert("Index array " + i + " will have " + inputArray[i].length + " elements");
	     inputArray[0][i] = i;
	   }
    }		
	
	////////////////////////////////////////////////////////////////////////////////////
   
   function AddExcluding(totalArray, exclusionArray)
   {
     var resultArray = [];
	 //alert("Attempting to create a bounds array, input values are " + PrintArray(totalArray) + " excluded values are " + PrintArray(exclusionArray));
     for (var i = 0; i < totalArray.length; i++)
	 {
	      if (!IsInArray(totalArray[i], exclusionArray))
		  {
	         resultArray.push(totalArray[i]);
		  }
	 }
	 return resultArray;
   }

	////////////////////////////////////////////////////////////////////////////////////   
   
   function IsInArray(item, array)
   {
     var returnValue = false;
	 
	 for (var i = 0; i < array.length; i++)
	 {
	    if (item == array[i])
		{
		   returnValue = true;
		   break;
		}
	 }
	 
	 return returnValue;
   }
   
	//////////////////////////////////////////////////////////////////////////////////// 
	
	function ReEntrantWrapper()
	{
	   // a wrapper object for new re-entrant functions
	   // the functionToCall function must be set externally
	   this.functionToCall = null;
	}