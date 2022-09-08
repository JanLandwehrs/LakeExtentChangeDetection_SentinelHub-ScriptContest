# Detection of Lake Extent Changes
Climate change contributes to more frequent or more severe droughts and floods in many regions of the world, among other things. Satellite Earth observation is extremely useful to document these changes, for example by monitoring water bodies. The Landsat program provides particularly useful data for demonstrating variations in the extent of lakes over the last decades, for example, as it provides the longest-running record of satellite observations since the 1970s.
This script is a custom Script for the Sentinel Hub EO Browser. It maps the extent of water bodies in two Landsat images defined by the user and then visualizes the chages between both scenes. The script is able to compare data both from the Landsat 8-9 Level-2 data sets (available since 02-2013) and the Landsat 4-5 TM Level-2 data sets (from 07-1984 to 05-2012). 

The script uses the water body detection method implemented by Mohor Gartner (https://github.com/sentinel-hub/custom-scripts/tree/master/sentinel-2/water_bodies_mapping-wbm). 

As an example, the pictures below show the Poyang Lake in August 1988 and 2022 as well as the lake extent changes detected by the presented script. The Poyang Lake is China’s largest freshwater lake and experiences significant lake level variations between the dry and the wet monsoon seasons. However, it experienced an extreme shrinkage in 2022 associated with a severe drought and heat wave in Southern China. Red and dark blue colors indicate retraction or expansion of the detected water bodies from the older to the more recent date, respectively. The automatically detected water body in the latter image comprises the light and dark blue areas.

Landsat 4-5-TM Level-2 True Color Image of Poyang Lake on 1988-08-13 ([EO Browser URL](https://apps.sentinel-hub.com/eo-browser/?zoom=10&lat=29.14511&lng=116.18321&themeId=DEFAULT-THEME&visualizationUrl=https%3A%2F%2Fservices.sentinel-hub.com%2Fogc%2Fwms%2F0cd456a8-dfef-400d-a340-b7448c4d7f03&datasetId=AWS_LTML2&fromTime=1988-08-13T00%3A00%3A00.000Z&toTime=1988-08-13T23%3A59%3A59.999Z&layerId=1_TRUE_COLOR&demSource3D=%22MAPZEN%22))
![image](https://github.com/JanLandwehrs/LakeExtentChangeDetection_SentinelHub-ScriptContest/blob/4c4538559a78e5656df307c483639016e27551f6/1988-08-13-00%2000_1988-08-13-23%2059_Landsat_4-5_TM_L2_True_color.png)

Landsat 8-9 Level-2 True Color Image of Poyang Lake on 2022-08-19 ([EO Browser URL](https://apps.sentinel-hub.com/eo-browser/?zoom=10&lat=29.18154&lng=116.14197&themeId=DEFAULT-THEME&visualizationUrl=https%3A%2F%2Fservices.sentinel-hub.com%2Fogc%2Fwms%2Ffa073661-b70d-4b16-a6a9-e866825f05fd&datasetId=AWS_LOTL2&fromTime=2022-08-19T00%3A00%3A00.000Z&toTime=2022-08-19T23%3A59%3A59.999Z&layerId=1_TRUE_COLOR&demSource3D=%22MAPZEN%22))
![image](https://github.com/JanLandwehrs/LakeExtentChangeDetection_SentinelHub-ScriptContest/blob/main/2022-08-19-00%2000_2022-08-19-23%2059_Landsat_8-9_L2_True_color.png)

Changes in the water body extent between both scenes detected by this script. (Red / Dark Blue: detected water body receded / expanded. Light Blue: water detected in both images.)
![image](https://github.com/JanLandwehrs/LakeExtentChangeDetection_SentinelHub-ScriptContest/blob/main/2022-08-19-00%2000_2022-08-19-23%2059_Landsat_8-9_L2_Custom_script.png)

Notes on how to use this script in the [SentinelHub EO Browser](https://apps.sentinel-hub.com/eo-browser):
 1. Find two days with suitable Landsat 4-5 TM or Landsat 8-9 records that you would like to compare.
 2. Load the scene of the later date in the EO Browser.
 3. Tick "Use additional datasets". Set the primary Datasource alias to "LOTL2" and the additonal Datasource alias to "LTML2". (Even when both sets actually are Landsat 8-9, or Landsat 4-5 TM. Sorry for the confusion, but custom generic aliases seemed not to work.)
 4. For the additional Datasource tick "Customize timespan" and set both fields to the date of the older scene.
 5. In the script, set date1 and date2 to match the dates of the scenes that shall be compared.
 6. Run the script (“Refresh Evalscript”)
