const translations = {
    english: `
        <div>
            <h2 class="option_form_each_title">Route Accessibility</h2>
            <input id="wheelchair" name="wheelchair" type="checkbox" value="true">
            <label for="wheelchair" class="option_label">Wheelchair</label>
            <input id="stroller" name="stroller" type="checkbox" value="true">
            <label for="stroller" class="option_label">Stroller</label>
            <input id="senior" name="senior" type="checkbox" value="true">
            <label for="senior" class="option_label">Senior</label>
        </div>
        <div>
            <h2 class="option_form_each_title">Levels of slopes to avoid</h2>
            <input type="radio" value="1" id="gentle" name="slope"/>
            <label class="option_label" for="gentle">Gentle</label>
            <input type="radio" value="2" id="moderate" name="slope"/>
            <label class="option_label" for="moderate">Moderate</label>
            <input type="radio" value="3" id="steep" name="slope"/>
            <label class="option_label" for="steep">Steep</label>
        </div>
        <div>
            <h2 class="option_form_each_title">Movement Speed</h2>
            <input type="radio" value="1" id="slow" name="speed"/>
            <label class="option_label" for="slow">Slow</label>
            <input type="radio" value="2" id="normal" name="speed"/>
            <label class="option_label" for="normal">Normal</label>
            <input type="radio" value="3" id="fast" name="speed"/>
            <label class="option_label" for="fast">Fast</label>
        </div>
    `,
    french: `
        <div>
            <h2 class="option_form_each_title">Accessibilité de l'itinéraire</h2>
            <input id="wheelchair" name="wheelchair" type="checkbox" value="true">
            <label for="wheelchair" class="option_label">Fauteuil roulant</label>
            <input id="stroller" name="stroller" type="checkbox" value="true">
            <label for="stroller" class="option_label">Poussette</label>
            <input id="senior" name="senior" type="checkbox" value="true">
            <label for="senior" class="option_label">Senior</label>
        </div>
        <div>
            <h2 class="option_form_each_title">Niveaux de pentes à éviter</h2>
            <input type="radio" value="1" id="gentle" name="slope"/>
            <label class="option_label" for="gentle">Faible</label>
            <input type="radio" value="2" id="moderate" name="slope"/>
            <label class="option_label" for="moderate">Moyen</label>
            <input type="radio" value="3" id="steep" name="slope"/>
            <label class="option_label" for="steep">Fort</label>
        </div>
        <div>
            <h2 class="option_form_each_title">Vitesse de déplacement</h2>
            <input type="radio" value="1" id="slow" name="speed"/>
            <label class="option_label" for="slow">Lente</label>
            <input type="radio" value="2" id="normal" name="speed"/>
            <label class="option_label" for="normal">Moyenne</label>
            <input type="radio" value="3" id="fast" name="speed"/>
            <label class="option_label" for="fast">Rapide</label>
        </div>
    `,
    spanish: `
        <div>
            <h2 class="option_form_each_title">Accesibilidad de la Ruta</h2>
            <input id="wheelchair" name="wheelchair" type="checkbox" value="true">
            <label for="wheelchair" class="option_label">Silla de ruedas</label>
            <input id="stroller" name="stroller" type="checkbox" value="true">
            <label for="stroller" class="option_label">Carrito</label>
            <input id="senior" name="senior" type="checkbox" value="true">
            <label for="senior" class="option_label">Mayor</label>
        </div>
        <div>
            <h2 class="option_form_each_title">Niveles de pendiente a evitar</h2>
            <input type="radio" value="1" id="gentle" name="slope"/>
            <label class="option_label" for="gentle">Bajo</label>
            <input type="radio" value="2" id="moderate" name="slope"/>
            <label class="option_label" for="moderate">Medio</label>
            <input type="radio" value="3" id="steep" name="slope"/>
            <label class="option_label" for="steep">Alto</label>
        </div>
        <div>
            <h2 class="option_form_each_title">Velocidad de movimiento</h2>
            <input type="radio" value="1" id="slow" name="speed"/>
            <label class="option_label" for="slow">Baja</label>
            <input type="radio" value="2" id="normal" name="speed"/>
            <label class="option_label" for="normal">Media</label>
            <input type="radio" value="3" id="fast" name="speed"/>
            <label class="option_label" for="fast">Alta</label>
        </div>
    `,
    korean: `
        <div>
            <h2 class="option_form_each_title">경로 접근성</h2>
            <input id="wheelchair" name="wheelchair" type="checkbox" value="true">
            <label for="wheelchair" class="option_label">휠체어</label>
            <input id="stroller" name="stroller" type="checkbox" value="true">
            <label for="stroller" class="option_label">유모차</label>
            <input id="senior" name="senior" type="checkbox" value="true">
            <label for="senior" class="option_label">노인</label>
        </div>
        <div>
            <h2 class="option_form_each_title">피할 경사 수준</h2>
            <input type="radio" value="1" id="gentle" name="slope"/>
            <label class="option_label" for="gentle">낮음</label>
            <input type="radio" value="2" id="moderate" name="slope"/>
            <label class="option_label" for="moderate">중간</label>
            <input type="radio" value="3" id="steep" name="slope"/>
            <label class="option_label" for="steep">높음</label>
        </div>
        <div>
            <h2 class="option_form_each_title">이동 속도</h2>
            <input type="radio" value="1" id="slow" name="speed"/>
            <label class="option_label" for="slow">느림</label>
            <input type="radio" value="2" id="normal" name="speed"/>
            <label class="option_label" for="normal">중간</label>
            <input type="radio" value="3" id="fast" name="speed"/>
            <label class="option_label" for="fast">빠름</label>
        </div>
    `
};

function changeLanguage() {
    const selectedLanguage = document.getElementById("language").value;
    document.getElementById("translatedContent").innerHTML = translations[selectedLanguage] || "";
}
