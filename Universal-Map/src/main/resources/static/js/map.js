// マップ情報
let map;
let directionsService;
let elevationService;
let currentLocation = null;

// 定数
const SPAN = 50; // ルートの区切り単位（メートル）
const STROKE_OPACITY = 0.75; // ルートの透明度
const STROKE_WEIGHT = 7; // ルートの太さ
const ZOOM = 18; // 拡大率（初期値）
const MAX_ROUTES = 32; // 最大ルート保管数
const Alpha = 0.5; // シグモイド関数のα（α > 0）

// ルート情報
let routeList; // ルート（APIから返ってくる情報）
let routeCount; // ルート数
let routeAngleLevelList; // 傾斜度などの情報
let routeDistanceList; // 距離の情報
let routeDurationList;
let routePolylines = []; // ポリラインの情報

// ユーザーオプションの取得
const wheelchairElement = document.getElementById('wheelchair');
const strollerElement = document.getElementById('stroller');
const seniorElement = document.getElementById('senior');
const slopeElement = document.getElementById('slope');
const speedElement = document.getElementById('speed');
const languageElement = document.getElementById('language');

// ユーザーオプションの変換
const WHEELCHAIR = wheelchairElement.textContent === 'true' ? true : false;
const STROLLER = strollerElement.textContent === 'true' ? true : false;
const SENIOR = seniorElement.textContent === 'true' ? true : false;
let SLOPE;
switch(slopeElement.textContent) {
	case '1': // gentle
		SLOPE = 5;
		break;
	case '2': // moderate
		SLOPE = 3;
		break;
	case '3': // steep
		SLOPE = 2;
		break;
	default:
		SLOPE = 5;
}
let SPEED;
switch(speedElement.textContent) {
	case '1': // slow
		SPEED = 2;
		break;
	case '2': // normal
		SPEED = 1;
		break;
	case '3': // fast
		SPEED = 0.75;
		break;
	default:
		SPEED = 1;
}
const LANGUAGE = languageElement.textContent;

// 出発地点のinputタグの処理（文字色とか初期値とか）
const originInput = document.getElementById('origin');
originInput.addEventListener('focus', () => {
	originInput.style.setProperty('--placeholder-color', 'gray');
});
originInput.addEventListener('blur', () => {
	originInput.style.setProperty('--placeholder-color', 'black');
});

// マップの初期化
initMap();

// マップの初期化関数
async function initMap() {
	// 各変数の初期化
	routeList = new Array(MAX_ROUTES);
	routeCount = 0;
	routeAngleLevelList = new Array(MAX_ROUTES);
	routeDistanceList = new Array(MAX_ROUTES);
	routeDurationList = new Array(MAX_ROUTES);
	
	// ルート一覧の初期化
	let routeElement = document.getElementById('changeRouteList');
	if (routeElement !== null) {
		while(routeElement.firstChild) {
			routeElement.removeChild(routeElement.firstChild);
		}
		document.getElementById('targetRoute').textContent = '';
		document.getElementById('targetDistance').textContent = '';
		document.getElementById('targetDuration').textContent = '';
		document.getElementById('targetDifficulty').textContent = '';
	}
	
	// 現在地の取得
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
                currentLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
                map = new google.maps.Map(document.getElementById('map'), {
                    center: currentLocation,
                    zoom: ZOOM,
                    mapId: "DEMO_MAP_ID",
                });
                new google.maps.marker.AdvancedMarkerElement({
                    position: currentLocation,
                    map: map,
                    title: 'Current Location',
                });
                directionsService = new google.maps.DirectionsService();
                elevationService = new google.maps.ElevationService();
            },
            () => { handleLocationError(true, map.getCenter()); }
        );
    } else {
        handleLocationError(false, map.getCenter());
    }
}

// マップのリセット関数（地図画面のみリセット）
function clearMap() {
    routePolylines.forEach(polyline => polyline.setMap(null)); // すべてのポリラインを削除
    routePolylines = []; // 配列をクリア
}

// エラー処理関数
function handleLocationError(browserHasGeolocation, pos) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 6
    });
    new google.maps.InfoWindow({
        content: browserHasGeolocation
            ? 'Error: The Geolocation service failed.'
            : 'Error: Your browser doesn\'t support geolocation.',
        position: pos
    }).open(map);
}

// ルート検索関数
function calculateRoute() {
    let origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const travelMode = document.getElementById('travelmode').value;
    const details = document.querySelectorAll('.detail');
    details.forEach((detail) => {
    detail.style.display = 'block';
});
    
    initMap(); // マップの初期化
    
    // 出発地点が未入力なら、現在地を指定
	if (!origin && currentLocation) {
	    origin = new google.maps.LatLng(currentLocation.lat, currentLocation.lng);
	}

	// ルート検索
    if (origin && destination && travelMode) {
        const request = {
            origin: origin, // 出発地点
            destination: destination, // 目的地
            travelMode: travelMode, // 移動手段
            provideRouteAlternatives: true, // 複数ルートの提案
            language: 'en', // 言語の指定
        };

        directionsService.route(request, (result, status) => {
            if (status === 'OK') {
				focusOnRoute(result);
                setRoutes(result);
            } else {
                alert('Could not display directions due to: ' + status);
            }
        });
    } else {
        alert('Please enter both origin and destination.');
    }
}

// ルート保存関数
function setRoutes(directionResult) {
	// 各ルートを描写する
    directionResult.routes.forEach((route, routeIndex) => {
		if (routeIndex < MAX_ROUTES) {
			// ルート情報の保存
			routeList[routeIndex] = route; // ルート自身の保存
			routeCount += 1; // ルートをカウント
			routeAngleLevelList[routeIndex] = 0;
			
			// 結果メッセージの更新
			document.getElementById('result').style.display = 'block';
			document.getElementById('resultMessage').textContent = `You have ${routeCount} routes.`;
			
			// ルート描写ボタンを追加
			let newElementLi = document.createElement('li');
			let newElementA = document.createElement('a');
			let changeRouteList = document.getElementById('changeRouteList');
			newElementA.textContent = `route${routeCount}`;
			newElementA.setAttribute('href', '');
			newElementA.setAttribute('onClick', `displayRoute(${routeIndex}); return false;`);
			newElementLi.appendChild(newElementA);
			changeRouteList.appendChild(newElementLi);
			
			// 最短ルートを描写
			if (routeIndex === 0) {
				displayRoute(routeIndex);
			}
		}
	})
}

// 秒→時間表示の変換関数
function formatSeconds(seconds) {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;
	let result = '';
	if (hours !== 0) {
		result += `${hours}h`;
	}
	if (minutes !== 0) {
		result += `${minutes}min `;
	}
	if (hours === 0 && minutes === 0) {
		result += `${secs}sec`;
	}
	return result;
}

// ルート描写関数（親プロセス）
function displayRoute(routeIndex) {
	clearMap(); // マップをリセット
	
	// 情報の保存
	const steps = routeList[routeIndex].legs[0].steps; // routeをstepに分割
	const fullRouteDistance = routeList[routeIndex].legs[0].distance.value; // ルート全体の距離（メートル）
	const fullRouteDuration = formatSeconds(Math.floor(routeList[routeIndex].legs[0].duration.value * SPEED)); // ルート全体の所要時間 × 歩行速度オプション
	routeDistanceList[routeIndex] = fullRouteDistance; // ルート全体の距離を保存
	routeDurationList[routeIndex] = fullRouteDuration; // ルート全体の所要時間を保存
	routeAngleLevelList[routeIndex] = 0;
	
	// stepごとに出力
    steps.forEach((step, stepIndex) => {
		// stepを定数SPANで指定した単位で区切る
        const path = step.path;
        const segments = splitPathIntoSegments(path, SPAN);

      	// 描写
        segments.forEach((segment, segmentIndex) => {
			const startLatLng = segment[0]; // 始点
        	const endLatLng = segment[segment.length - 1]; // 終点
        	mapping(segment, startLatLng, endLatLng, [routeIndex, stepIndex, segmentIndex], fullRouteDistance); // 地図の描写
        });
    });
    
    // htmlファイルの更新
	document.getElementById('targetRoute').textContent = `${routeIndex+1}`;
	document.getElementById('targetDistance').textContent = `${Math.round(routeDistanceList[routeIndex]*10/1000)/10}km`;
	document.getElementById('targetDuration').textContent = `${routeDurationList[routeIndex]}`;
}

// ルートを分割する関数
function splitPathIntoSegments(path, segmentLengthMeters) {
    const segments = [];
    let currentSegment = [path[0]];
    let accumulatedDistance = 0;

    for (let i = 1; i < path.length; i++) {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(path[i - 1], path[i]);
        accumulatedDistance += distance;

        if (accumulatedDistance >= segmentLengthMeters) {
            currentSegment.push(path[i]);
            segments.push(currentSegment);
            currentSegment = [path[i]];
            accumulatedDistance = 0;
        } else {
            currentSegment.push(path[i]);
        }
    }

    if (currentSegment.length > 1) {
        segments.push(currentSegment);
    }

    return segments;
}

// 画面のフォーカスを調整する関数
function focusOnRoute(directionResult) {
    const bounds = new google.maps.LatLngBounds();
    const route = directionResult.routes[0].overview_path;
    route.forEach((point) => {
        bounds.extend(point);
    });
    map.fitBounds(bounds);
}

// ２地点間の距離を計測する関数
function calculateDistance(latLng1, latLng2) {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(latLng1, latLng2);
    return distance;
}

// ２地点間の高低差を計測する関数
function calculateElevationDifference(latLng1, latLng2) {
    return new Promise((resolve, reject) => {
        const locations = [latLng1, latLng2];

        elevationService.getElevationForLocations({ locations: locations }, (results, status) => {
            if (status === 'OK' && results.length === 2) {
                const elevation1 = results[0].elevation;
                const elevation2 = results[1].elevation;
                const elevationDifference = elevation1 - elevation2;
                resolve(elevationDifference);
            } else {
                reject('Elevation service failed due to: ' + status);
            }
        });
    });
}

// 傾斜レベルメッセージを返す関数
function getMessageByAngleLevel(angleLevel) {
	if (angleLevel > SLOPE) {
		return 'Impossible route';
	} else if (angleLevel > SLOPE/2) {
		return 'Difficult route';
	} else {
		return 'Recommended route';
	}
}

// 傾斜を引数にしてカラーコード（RGB）を返す関数
function getColorCode(angle) {
	let red;
	let green;
	let blue;
	if (angle > 0) {
		red = 255;
		green = Math.floor(sigmoid(-1 * Math.abs(angle), Alpha) * 2 * 255);
		blue = 0;
	} else if (angle < 0) {
		red = 0;
		green = 255;
		blue = Math.floor(sigmoid(Math.abs(angle), Alpha) * 255);
	} else {
		red = 255;
		green = 255;
		blue = 0;
	}
	return [red, green, blue];
}

// シグモイド関数（RGBの指定に使う）
function sigmoid(x, a) {
	return 1 / (1 + Math.exp(1) ** (-1 * a * x));
}

// ルート描写関数（子プロセス）
async function mapping(segment, latlng1, latlng2, indexes, fullRouteDistance) {
	try {
        const difference = await calculateElevationDifference(latlng1, latlng2); // 高低差の取得（メートル）
        const distance = calculateDistance(latlng1, latlng2); // 距離の取得（メートル）
        const arg = Math.asin(difference/distance) * (180/Math.PI); // 傾斜の取得（度）
        await (routeAngleLevelList[indexes[0]] += Math.abs(arg) * distance / fullRouteDistance); // 角度レベルの計算
        document.getElementById('targetDifficulty').textContent = getMessageByAngleLevel(routeAngleLevelList[indexes[0]]); // 傾斜レベルメッセージの更新
        
        // 色の設定
    	const colorRGB = getColorCode(arg);
    	const color = `rgb(${colorRGB[0]},${colorRGB[1]},${colorRGB[2]})`;
        
        // 地図上にマッピング
        const segmentLine = new google.maps.Polyline({
            path: segment,
            geodesic: true,
            strokeColor: color, // 色
            strokeOpacity: STROKE_OPACITY, // 透明度
            strokeWeight: STROKE_WEIGHT // 太さ
        });
        segmentLine.setMap(map);
        
        routePolylines.push(segmentLine); // ポリラインを配列に保存
    } catch (error) {
        console.error(error);
    }
}

const language = document.getElementById("language").textContent;
const message = {
    english: {
        origin_content: "Origin",
        destination_content: "Destination",
        travelMode: "Travel Mode",
        walking: "WALKING",
        cycle: "BYCYCLING",
        showButton: "Show Route",
        resultMessage: "Input origin and destination"
    },
    french: {
        origin_content: "Origine",
        destination_content: "Destination",
        travelMode: "Mode de déplacement",
        walking: "MARCHER",
        cycle: "VELO",
        showButton: "Afficher l'itinéraire",
        resultMessage: "Entrer l'origine et la destination"
    },
    spanish: {
        origin_content: "Origen",
        destination_content: "Destino",
        travelMode: "Modo de viaje",
        walking: "CAMINANDO",
        cycle: "BICICLETA",
        showButton: "Mostrar Ruta",
        resultMessage: "Ingrese origen y destino"
    },
    korean: {
        origin_content: "출발지",
        destination_content: "목적지",
        travelMode: "이동 모드",
        walking: "도보",
        cycle: "자전거",
        showButton: "경로 표시",
        resultMessage: "출발지와 목적지를 입력하세요"
    }
};



function updateText(language){
	Object.keys(message[language]).forEach(key => {
		document.getElementById(key).textContent = message[language][key];
	})
}
updateText(language);

// 地図画面（index.html）の表示 
// panelの高さを取得し、100vhからpanelの高さを引いた高さを.index_mapの高さに指定
function adjustMapHeight() {
    // panelの高さを取得
    const panelHeight = document.getElementById("panel").offsetHeight;

    // .index_mapのmargin-topを取得
    const mapElement = document.getElementById("map");
    const mapMarginTop = parseInt(window.getComputedStyle(mapElement).marginTop) || 0;

    // 100vhからpanelの高さ、margin-top、8pxを引いた高さを計算
    const mapHeight = window.innerHeight - panelHeight - mapMarginTop - 8;

    // 計算結果をmapの高さに設定
    mapElement.style.height = `${mapHeight}px`;
}
// 初回の読み込み時とウィンドウのリサイズ時に実行
window.addEventListener("load", adjustMapHeight);
window.addEventListener("resize", adjustMapHeight);

// Show Route ボタンを押したときにも実行
// （2回実行は1回目の実行後に追加される.detail_upperの高さも100vhから引くため）
document.querySelector(".show_route").addEventListener("click", () => {
    adjustMapHeight();
    adjustMapHeight();
});