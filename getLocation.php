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
    $_SESSION['menu'] = $data;
    $categories = [];
    $html = '';
    $arr = [];
    
    // Menu items based on category
    if ($data->menu->menu_items) {
        foreach($data->menu->menu_items as $menuItems) {
            $catName = str_replace(array('/', ' '), '_', $menuItems->category_name);
            if (!in_array($menuItems->category_name, $categories)) {
                array_push($categories,$menuItems->category_name);
                $html .= '<div id="'.strtolower($catName).'" class="items active" onclick="getMenu('.strtolower($catName).')"><a href="#">'.$menuItems->category_name.'</a></div>';  
            }
            $arr[strtolower($catName)][$menuItems->menu_item_name] = [];
            array_push($arr[strtolower($catName)][$menuItems->menu_item_name], $menuItems->is_veg);
            array_push($arr[strtolower($catName)][$menuItems->menu_item_name], $menuItems->price);

        }
    }
    $output = [$arr,$html];
    echo json_encode($output);
}
?>