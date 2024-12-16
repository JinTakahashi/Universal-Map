let currentLanguage;
		
function changeLanguage() {
	const selectedLanguage = document.getElementById("language").value;
    const allLangElements = document.getElementsByClassName("lang");
	    // すべての言語要素を非表示にする
    for (let i = 0; i < allLangElements.length; i++) {
        allLangElements[i].style.display = "none";
    }
		
    // 選択された言語の要素を表示する
    if (selectedLanguage) {
        const selectedLangElements = document.getElementsByClassName(selectedLanguage);
        for (let i = 0; i < selectedLangElements.length; i++) {
            selectedLangElements[i].style.display = "block";
        }
    }
	currentLanguage = selectedLanguage;
}

changeLanguage();
		// 対象のボタン
		// この変数のパラメータを動的に変更したい
const backButton = document.getElementById('back_button');
const classlist = { english: 'en', 
					french: 'fr', 
					spanish: 'sp', 
					korean: 'ko'};
		// 言語のセレクトボックス
let accessList = document.getElementsByClassName(`access ${classlist[currentLanguage]}`);
	
		// スロープのオプション（配列）
let slopeList = document.getElementsByClassName(`slope ${classlist[currentLanguage]}`);
	
		// スピード（配列）
let speedList = document.getElementsByClassName(`speed ${classlist[currentLanguage]}`);
	
const userId = document.getElementById('userId').value; 
	
	
	
backButton.addEventListener('click', function(event) {
		event.preventDefault(); // <a>タグのデフォルト動作をキャンセル
	    // 現在のパラメータを取得
		const language = currentLanguage;
		accessList = document.getElementsByClassName(`access ${classlist[currentLanguage]}`);
		slopeList = document.getElementsByClassName(`slope ${classlist[currentLanguage]}`);
		speedList = document.getElementsByClassName(`speed ${classlist[currentLanguage]}`);
	    // 各オプションの値を取得
		const wheelchair = accessList[0].checked;
		const stroller = accessList[1].checked;
		const senior = accessList[2].checked;
		const slope = Array.from(slopeList).find(item => item.checked)?.value;
		const speed = Array.from(speedList).find(item => item.checked)?.value;
		const params = new URLSearchParams({
		    id: userId,
		    language: language,
		    wheelchair: wheelchair,
		    stroller: stroller,
		    senior: senior,
		    slope: slope,
		    speed: speed
		});						
		const url = `/index?${params.toString()}`;
		window.location.href = url;
});