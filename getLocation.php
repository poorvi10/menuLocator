<?php
//if latitude and longitude are submitted
if(!empty($_POST['latitude']) && !empty($_POST['longitude'])){

    //send request and receive json data by latitude and longitude
    $url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='.trim($_POST['latitude']).','.trim($_POST['longitude']).'&sensor=false';
    $json = @file_get_contents($url);
    $data = json_decode($json);
    $status = $data->status;
    
    //if request status is successful
    if($status == "OK"){
        //get address from json data
        $location = $data->results[0]->formatted_address;
    }else{
        $location =  '';
    }
    
    //return address to ajax 
    echo $location;
}

/* Show menu items */
if (!empty($_POST['lat']) && !empty($_POST['lgt']) && !empty($_POST['address'])) {
    $url = 'https://jsonblob.com/api/jsonBlob/b235e32f-8250-11e7-8e2e-893ffec7f2e1';
    $json = @file_get_contents($url);
    $data = json_decode($json);
    $status = $data->status;
    $arr['Starters'] = [];
    $arr['Regional_Desi_Delights'] = [];
    $arr['Main_course'] = [];
    $arr['Rice_Paratha'] = [];
    $arr['Desserts_Beverages'] = [];
    $arr['501'] = [];
    $_SESSION['menu'] = $data;

    // Menu items based on category
    if ($data->menu->menu_items) {
        foreach($data->menu->menu_items as $menuItems) {

            if ($menuItems->category_name === 'Starters') {
                $arr['Starters'][$menuItems->menu_item_name] = [];
                array_push($arr['Starters'][$menuItems->menu_item_name], $menuItems->is_veg);
                array_push($arr['Starters'][$menuItems->menu_item_name], $menuItems->price);
            } else if ($menuItems->category_name === 'Regional Desi Delights') {
                $arr['Regional_Desi_Delights'][$menuItems->menu_item_name] = [];
                array_push($arr['Regional_Desi_Delights'][$menuItems->menu_item_name], $menuItems->is_veg);
                array_push($arr['Regional_Desi_Delights'][$menuItems->menu_item_name], $menuItems->price);
            } else if ($menuItems->category_name === 'Main course') {
                $arr['Main_course'][$menuItems->menu_item_name] = [];
                array_push($arr['Main_course'][$menuItems->menu_item_name], $menuItems->is_veg);
                array_push($arr['Main_course'][$menuItems->menu_item_name], $menuItems->price);
            } else if ($menuItems->category_name === 'Rice/Paratha') {
                $arr['Rice_Paratha'][$menuItems->menu_item_name] = [];
                array_push($arr['Rice_Paratha'][$menuItems->menu_item_name], $menuItems->is_veg);
                array_push($arr['Rice_Paratha'][$menuItems->menu_item_name], $menuItems->price);
            } else if ($menuItems->category_name === 'Desserts/Beverages') {
                $arr['Desserts_Beverages'][$menuItems->menu_item_name] = [];
                array_push($arr['Desserts_Beverages'][$menuItems->menu_item_name], $menuItems->is_veg);
                array_push($arr['Desserts_Beverages'][$menuItems->menu_item_name], $menuItems->price);
            } else {
                $arr['error'] = "Select location to browse through the menu";
            }
        }
    }
    echo json_encode($arr);
}
?>