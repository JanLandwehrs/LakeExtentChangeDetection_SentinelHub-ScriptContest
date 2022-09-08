//VERSION=3
/*
DETECTION OF LAKE EXTENT CHANGES

Detect changes of water body extent between two Landsat images. The scenes can be from the Landsat 4-5 TM and Landsat 8-9 Level-2 data sets which range from 1984 to 2022. 

The script makes use of the water bodies mapping function implemented by Mohor Gartner.
https://github.com/sentinel-hub/custom-scripts/tree/master/sentinel-2/water_bodies_mapping-wbm

Author: Jan Landwehrs (https://www.linkedin.com/in/jan-landwehrs-a37009130)
*/

// Set date1 and date2 to the dates of the two Landsat scenes that shall be compared. 
// (date1 should be the older one)
// For the Poyang Lake example: date1="1988-08-13" , date2="2022-08-19"
var date1="1988-08-13" 
var date2="2022-08-19"
var date1_date = new Date(date1);
var date2_date = new Date(date2);
var year1 = date1_date.getFullYear();
var year2 = date2_date.getFullYear();
// The last  first dates for which the Landsat 4-5 TM / Landsat 8-9 data set s are available
var Landsat45TM_end_date = new Date("2012-05-01T00:00:00Z");
var Landsat89_start_date = new Date("2013-02-01T00:00:00Z");

// Modifiy the setup function, depending on whether the two selected dates fall into the ranges of the Landsat 4-5 TM or Landsat 8-9 temporal coverages.
if (date1_date > Landsat89_start_date) {
    function setup() { return { input: [
        {datasource: "LOTL2", bands:["B02","B03","B04","B05","B06","B07"], mosaicking: "ORBIT"},
        {datasource: "LTML2", bands:["B02","B03","B04","B05","B06","B07"], mosaicking: "ORBIT"}, ],
        output: [ { id: "default", bands: 3, sampleType: SampleType.AUTO } ] }; } }
else if (date1_date < Landsat45TM_end_date && date2_date > Landsat89_start_date) {
    function setup() { return { input: [
        {datasource: "LOTL2", bands:["B02","B03","B04","B05","B06","B07"], mosaicking: "ORBIT"},
        {datasource: "LTML2", bands:["B01","B02","B03","B04","B05","B07"], mosaicking: "ORBIT"}, ],
        output: [ { id: "default", bands: 3, sampleType: SampleType.AUTO } ] }; } }  
else if (date2_date < Landsat45TM_end_date) {
    function setup() { return { input: [ 
        {datasource: "LOTL2", bands:["B01","B02","B03","B04","B05","B07"], mosaicking: "ORBIT"}, {datasource: "LTML2", bands:["B01","B02","B03","B04","B05","B07"], mosaicking: "ORBIT"}, ],
        output: [ { id: "default", bands: 3, sampleType: SampleType.AUTO } ] }; } } 

// Make sure to use only the scenes from the desired dates are selected.      
function filterScenes (availableScenes, inputMetadata) {
    var allowedDates = [date1,date2];
    return availableScenes.filter(function (scene) {
        var sceneDateStr = scene.date.toISOString().split("T")[0]; 
        return allowedDates.includes(sceneDateStr);
    });
}
// According to the documentation, the "preProcessScenes" function should now be used instead. But this didn't work for me.
// https://docs.sentinel-hub.com/api/latest/evalscript/v3/#filterscenes-function-optional-deprecated 


function evaluatePixel(samples,scenes) {
 
    let s1 = samples.LTML2[0]
    let s2 = samples.LOTL2[0]
    
    // Landsat 4-5 TM or Landsat 8-9 differ in their band configuration. For the water body detection, the red, green, blue and NIR, SWIR1, SWIR2 values have to be taken from the respective bands. 
    if (date1_date > Landsat89_start_date) {       
        var b_1=s1.B02,g_1=s1.B03,r_1=s1.B04, nir_1=s1.B05,swir1_1=s1.B06,swir2_1=s1.B07;
        var b_2=s2.B02,g_2=s2.B03,r_2=s2.B04, nir_2=s2.B05,swir1_2=s2.B06,swir2_2=s2.B07;
    }
    else if (date1_date < Landsat45TM_end_date && date2_date > Landsat89_start_date) {        
        var b_1=s1.B01,g_1=s1.B02,r_1=s1.B03, nir_1=s1.B04,swir1_1=s1.B05,swir2_1=s1.B07;
        var b_2=s2.B02,g_2=s2.B03,r_2=s2.B04, nir_2=s2.B05,swir1_2=s2.B06,swir2_2=s2.B07;
    }
    else if (date2_date < Landsat45TM_end_date) {        
        var b_1=s1.B01,g_1=s1.B02,r_1=s1.B03, nir_1=s1.B04,swir1_1=s1.B05,swir2_1=s1.B07;
        var b_2=s2.B01,g_2=s2.B02,r_2=s2.B03, nir_2=s2.B04,swir1_2=s2.B05,swir2_2=s2.B07;
    }

    // Detect the water body extent in both scenes, using the method implemented by Mohor Gartner (https://github.com/sentinel-hub/custom-scripts/tree/master/sentinel-2/water_bodies_mapping-wbm)
    water1=wbi(r_1,g_1,b_1,nir_1,swir1_1,swir2_1);   
    water2=wbi(r_2,g_2,b_2,nir_2,swir1_2,swir2_2);    
    // Compute the difference between the two water body masks. 
    water_diff=water1 - water2;
    
    //land color
    let RGB=[r_2,g_2,b_2].map(a=>2*a);
    
    // Visualize the detected water body changes with true color image at date2 in the background.
    // Red color: Water detected at date1, but not at date2 (-> receded water body)
    // Dark blue color: Water detected at date2, but not at date1 (-> expanded water body)
    // Light blue color: Water detected at date2 and date1
    if (water_diff>0.1) return [1,0,0]; if (water_diff<-0.1) return [0,0,1]; else if (water1>=0.1) return [0.44,0.54,1]; else return RGB;
}

// Water bodies mapping function by Mohor Gartner (https://github.com/sentinel-hub/custom-scripts/tree/master/sentinel-2/water_bodies_mapping-wbm)
function wbi(r,g,b,nir,swir1,swir2) {
    //water surface
    let ws=0;
    
    var MNDWI_threshold=0.42; //testing shows recommended 0.42 for Sentinel-2 and Landsat 8. For the scene in article [1] it was 0.8. // 
    var NDWI_threshold=0.4; //testing shows recommended 0.4 for Sentinel-2 and Landsat 8. For the scene in article [1] it was 0.5.
    //// 3. Turn on/off filtering of false detections
    ////For some scenes (low level illumination, etc.) it might filter out also water bodies. In that case, turn off filtering.
    //urban areas & bare soil. Recommended=true.
    var filter_UABS=true;
    //shadows, snow/ice. Recommended=false. Use in low level illumination scenes: clouds, mountainous shadowy areas, winter season. Usually it is good to turn the filter on in multitemporal analysis.
    var filter_SSI=false;
        
    //try as it might fail for some pixel
    try {
        var ndvi=(nir-r)/(nir+r),mndwi=(g-swir1)/(g+swir1),ndwi=(g-nir)/(g+nir),ndwi_leaves=(nir-swir1)/(nir+swir1),aweish=b+2.5*g-1.5*(nir+swir1)-0.25*swir2,aweinsh=4*(g-swir1)-(0.25*nir+2.75*swir1);
        //[10][11][12]
        var dbsi=((swir1-g)/(swir1+g))-ndvi,wii=Math.pow(nir,2)/r,wri=(g+r)/(nir+swir1),puwi=5.83*g-6.57*r-30.32*nir+2.25,uwi=(g-1.1*r-5.2*nir+0.4)/Math.abs(g-1.1*r-5.2*nir),usi=0.25*(g/r)-0.57*(nir/g)-0.83*(b/g)+1;
        //DEFINE WB
        if (mndwi>MNDWI_threshold||ndwi>NDWI_threshold||aweinsh>0.1879||aweish>0.1112||ndvi<-0.2||ndwi_leaves>1) {ws=1;}
        
        //filter urban areas [3] and bare soil [10]
        if (filter_UABS && ws==1) {
            if ((aweinsh<=-0.03)||(dbsi>0)) {ws=0;}
        }
        //filter shadows and snow/ice
        if (filter_SSI && ws==1) {
            //SHADOWS[3]
            if ((aweish<=0.1112&&ndvi>-0.2)){ws=0;}
            if ((aweinsh<0.5&&ndvi>-0.2)){ws=0;} //or 0.1897
            if (((aweinsh<0||aweish<=0||ndvi>-0.1))){ws=0;}
            //SNOW AREAS[6][7][8]
            if ((((g>=0.319)?((mndwi>0.2)?((nir>0.15)?((b>0.18)?1:0):0):0):0))){ws=0;}
            if (g>0.319){ws=0;}
            //WII,WRI[11]
            if (wii>0.04||wri<2){ws=0;}
            //PUWI,UWI,USI[12]
            if (puwi<0||uwi<0||usi<=-1){ws=0;}
            //spectrum based[13]
            if (mndwi<aweinsh){ws=0;}
            if (ndwi-aweinsh>0.5){ws=0;}
        }
    }catch(err){ws=0;}
    return ws;
}


