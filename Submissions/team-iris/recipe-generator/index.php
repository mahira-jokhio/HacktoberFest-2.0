<?php
require_once __DIR__ . '/vendor/autoload.php';

use Gemini\Data\GenerationConfig;
use Gemini\Data\Schema;
use Gemini\Enums\DataType;
use Gemini\Enums\ResponseMimeType;
use Dotenv\Dotenv;
use GuzzleHttp\Client;

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$path = trim($path, '/');

if ($path == 'api/recipe/generate' && $_SERVER['REQUEST_METHOD'] == 'POST') {
  try {
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    $ingredients = isset($_POST['ingredients']) ? $_POST['ingredients'] : null;
    $language = isset($_POST['language']) ? $_POST['language'] : 'en';

    if (!$ingredients) {
      echo json_encode(['error' => 'You must provide the available ingredients, to generate the recipes']);
      exit;
    }

    // Language names for AI prompt
    $languageNames = [
      'en' => 'English',
      'es' => 'Spanish',
      'fr' => 'French',
      'de' => 'German',
      'it' => 'Italian',
      'pt' => 'Portuguese',
      'ru' => 'Russian',
      'ja' => 'Japanese',
      'ko' => 'Korean',
      'zh' => 'Chinese',
      'ar' => 'Arabic',
      'hi' => 'Hindi',
      'ur' => 'Urdu',
      'sd' => 'Sindhi'
    ];

    $outputLanguage = $languageNames[$language] ?? 'English';

    $gemini = Gemini::client($_ENV['GEMINI_API_KEY'])->generativeModel('gemini-2.0-flash-lite');

    $result = $gemini->withGenerationConfig(
      generationConfig: new GenerationConfig(
        responseMimeType: ResponseMimeType::APPLICATION_JSON,
        responseSchema: new Schema(
          type: DataType::ARRAY,
          items: new Schema(
            type: DataType::OBJECT,
            properties: [
              'recipe_name' => new Schema(type: DataType::STRING),
              'steps' => new Schema(
                type: DataType::ARRAY,
                items: new Schema(DataType::STRING)
              ),
              'cooking_time_in_minutes' => new Schema(type: DataType::INTEGER),
              'prompt_for_image' => new Schema(type: DataType::STRING, description: 'A detailed prompt for a realistic image generation model, to generate the final dish as an image.')
            ],
            required: ['recipe_name', 'cooking_time_in_minutes'],
          )
        )
      )
    )->generateContent("Act as a cook, and provide me some recipes that are possible to cook with these ingredients: $ingredients\n\n\nOUTPUT LANGUAGE: $outputLanguage\n\nIMPORTANT: Respond in $outputLanguage only. Recipe name, steps, and all content must be in $outputLanguage.");

    $recipes = (array)$result->json();

    $recipes_array = [];

    // Process each recipe and generate images
    foreach ($recipes as $recipe) {
      $recipe = (array)$recipe;
      // Generate an image for this recipe if we have an image prompt
      if (isset($recipe['prompt_for_image']) && !empty($recipe['prompt_for_image'])) {
        $imageFilename = preg_replace('/[^a-zA-Z0-9]/', '_', $recipe['recipe_name']) . '.png';
        $imagePath = __DIR__ . '/generated_images/' . $imageFilename;

        // Create directory if it doesn't exist
        $imageDir = __DIR__ . '/generated_images';
        if (!is_dir($imageDir)) {
          mkdir($imageDir, 0755, true);
        }

        // Generate the image using our function
        $imageGenerated = generateImageWithGemini(
          $recipe['prompt_for_image'],
          $imagePath
        );

        // Add image path to recipe data if generation was successful
        if ($imageGenerated) {
          $recipe['generated_image_path'] = '/generated_images/' . $imageFilename;
        }
        $recipes_array[] = $recipe;
      }
    }

    echo json_encode($recipes_array);
  } catch (Throwable $th) {
    echo json_encode(['error' => 'something went wrong!' . $th->getMessage()]);
  } finally {
    exit;
  }
}

/**
 * Generate an image using Gemini AI and save it to a file
 * PHP equivalent of the curl command for image generation
 *
 * @param string $prompt The text prompt for image generation
 * @param string $outputPath Path where the image should be saved
 * @param string $apiKey Gemini API key (optional, will use env var if not provided)
 * @return bool Success status
 */
function generateImageWithGemini($prompt, $outputPath, $apiKey = null)
{
  try {
    // Load environment variables if not already loaded
    if (!isset($_ENV['GEMINI_API_KEY'])) {
      $dotenv = Dotenv::createImmutable(__DIR__);
      $dotenv->load();
    }

    $apiKey = $apiKey ?: ($_ENV['GEMINI_API_KEY'] ?? '');
    if (empty($apiKey)) {
      throw new Exception('Gemini API key not found');
    }

    // Prepare the request payload
    $payload = [
      'contents' => [
        [
          'parts' => [
            ['text' => $prompt]
          ]
        ]
      ]
    ];

    // Initialize Guzzle HTTP client
    $client = new Client([
      'timeout' => 30,
      'headers' => [
        'Content-Type' => 'application/json'
      ]
    ]);

    // Make the API request - use the correct image generation model
    $response = $client->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=" . $apiKey, [
      'json' => $payload
    ]);

    $responseData = json_decode($response->getBody(), true);

    // Extract base64 image data from response
    if (isset($responseData['candidates'][0]['content']['parts'][0]['inline_data']['data'])) {
      $base64Data = $responseData['candidates'][0]['content']['parts'][0]['inline_data']['data'];

      // Decode and save the image
      $imageData = base64_decode($base64Data);
      if ($imageData === false) {
        throw new Exception('Failed to decode base64 image data');
      }

      $result = file_put_contents($outputPath, $imageData);
      if ($result === false) {
        throw new Exception('Failed to save image to file');
      }

      return true;
    } else {
      throw new Exception('No image data found in API response');
    }
  } catch (Exception $e) {
    error_log('Image generation failed: ' . $e->getMessage());
    return false;
  }
}

// Example usage function for recipe images
function generateRecipeImage($recipeName, $prompt, $outputPath = null)
{
  if (!$outputPath) {
    $outputPath = __DIR__ . '/generated_images/' . preg_replace('/[^a-zA-Z0-9]/', '_', $recipeName) . '.png';

    // Create directory if it doesn't exist
    $dir = dirname($outputPath);
    if (!is_dir($dir)) {
      mkdir($dir, 0755, true);
    }
  }

  return generateImageWithGemini($prompt, $outputPath);
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🍳 AI Recipe Generator</title>

  <style>
    <?php require __DIR__ . '/css/styles.css'; ?>
  </style>
</head>

<body class="min-h-screen bg-gray-50">
  <div class="max-w-2xl mx-auto px-6 py-12">
    <!-- Header -->
    <header class="text-center mb-16">
      <h1 class="text-4xl font-light text-gray-900 mb-4">
        Recipe Generator
      </h1>
      <p class="text-lg text-gray-600">
        Enter ingredients to get AI-powered recipe suggestions
      </p>
    </header>

    <!-- Language Selector -->
    <div class="flex justify-end mb-4">
      <div class="relative">
        <select id="languageSelect" class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-gray-900">
          <option value="en">🇺🇸 English</option>
          <option value="es">🇪🇸 Español</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="it">🇮🇹 Italiano</option>
          <option value="pt">🇵🇹 Português</option>
          <option value="ru">🇷🇺 Русский</option>
          <option value="ja">🇯🇵 日本語</option>
          <option value="ko">🇰🇷 한국어</option>
          <option value="zh">🇨🇳 中文</option>
          <option value="ar">🇸🇦 العربية</option>
          <option value="hi">🇮🇳 हिन्दी</option>
          <option value="ur">🇵🇰 اردو</option>
          <option value="sd">🇵🇰 سنڌي</option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Input Section -->
    <div class="bg-white rounded-lg border border-gray-200 p-8 mb-8">
      <form id="recipeForm" class="space-y-6">
        <div>
          <label for="ingredients" class="block text-sm font-medium text-gray-900 mb-3">
            <span data-translate="ingredients_label">What ingredients do you have?</span>
          </label>
          <textarea
            id="ingredients"
            name="ingredients"
            rows="4"
            class="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-gray-900 focus:outline-none transition-colors resize-none"
            placeholder data-translate="ingredients_placeholder"
            required></textarea>
        </div>

        <button
          type="submit"
          id="generateBtn"
          class="w-full bg-gray-900 hover:bg-black text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
          <span id="btnText" data-translate="generate_btn">Generate Recipe</span>
        </button>
      </form>
    </div>

    <!-- Recipe Display Section -->
    <div id="recipeSection" class="bg-white rounded-lg border border-gray-200 p-8 hidden">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-xl font-medium text-gray-900">Your Recipe</h2>
        <button id="newRecipeBtn" class="text-sm text-gray-600 hover:text-gray-900">
          ← New recipe
        </button>
      </div>

      <!-- Recipe Content -->
      <div id="recipeContent">
        <!-- Recipe will be displayed here -->
      </div>
    </div>

    <!-- Loading State -->
    <div id="loadingOverlay" class="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center hidden z-50">
      <div class="text-center">
        <div class="animate-pulse text-gray-400 text-2xl mb-4">🍳</div>
        <p class="text-gray-600">Creating recipe...</p>
      </div>
    </div>
  </div>

  <script>
    // Multi-language translation system
    const translations = {
      'en': {
        'ingredients_label': 'What ingredients do you have?',
        'ingredients_placeholder': 'chicken, rice, tomatoes, onions...',
        'generate_btn': 'Generate Recipe',
        'generating': 'Generating...',
        'recipe_title': 'Your Recipe',
        'new_recipe': '← New recipe',
        'ai_generated': 'AI Generated',
        'ingredients_from_kitchen': 'Ingredients (from your kitchen)',
        'ingredients_uses': 'This recipe uses the ingredients you provided',
        'instructions': 'Instructions',
        'follow_steps': 'Follow the steps provided by the AI chef above.',
        'ai_note': '🤖 AI Generated: This recipe was created by AI based on your ingredients. Cooking times and results may vary.',
        'demo_mode': '⚠️ Demo Mode: Connect your Gemini API key to get real AI-generated recipes.',
        'demo_recipe': 'Demo Recipe',
        'cook_time': 'mins cook',
        'prep_time': 'mins prep',
        'serves': 'Serves',
        'difficulty': 'Difficulty',
        'creating_recipe': 'Creating recipe...',
        'enter_ingredients': 'Please enter some ingredients!',
        'error_recipe': 'Error generating recipe. Please try again.',
        'no_ingredients': 'Please enter some ingredients!',
        'ingredients_required': 'Please enter some ingredients!'
      },
      'es': {
        'ingredients_label': '¿Qué ingredientes tienes?',
        'ingredients_placeholder': 'pollo, arroz, tomates, cebollas...',
        'generate_btn': 'Generar Receta',
        'generating': 'Generando...',
        'recipe_title': 'Tu Receta',
        'new_recipe': '← Nueva receta',
        'ai_generated': 'Generado por IA',
        'ingredients_from_kitchen': 'Ingredientes (de tu cocina)',
        'ingredients_uses': 'Esta receta usa los ingredientes que proporcionaste',
        'instructions': 'Instrucciones',
        'follow_steps': 'Sigue los pasos proporcionados por el chef IA arriba.',
        'ai_note': '🤖 Generado por IA: Esta receta fue creada por IA basada en tus ingredientes. Los tiempos de cocción y resultados pueden variar.',
        'demo_mode': '⚠️ Modo Demo: Conecta tu clave API de Gemini para obtener recetas reales generadas por IA.',
        'demo_recipe': 'Receta Demo',
        'cook_time': 'mins cocción',
        'prep_time': 'mins preparación',
        'serves': 'Sirve',
        'difficulty': 'Dificultad',
        'creating_recipe': 'Creando receta...',
        'enter_ingredients': '¡Por favor ingresa algunos ingredientes!',
        'error_recipe': 'Error al generar receta. Por favor intenta de nuevo.',
        'no_ingredients': '¡Por favor ingresa algunos ingredientes!',
        'ingredients_required': '¡Por favor ingresa algunos ingredientes!'
      },
      'fr': {
        'ingredients_label': 'Quels ingrédients avez-vous ?',
        'ingredients_placeholder': 'poulet, riz, tomates, oignons...',
        'generate_btn': 'Générer une Recette',
        'generating': 'Génération...',
        'recipe_title': 'Votre Recette',
        'new_recipe': '← Nouvelle recette',
        'ai_generated': 'Généré par IA',
        'ingredients_from_kitchen': 'Ingrédients (de votre cuisine)',
        'ingredients_uses': 'Cette recette utilise les ingrédients que vous avez fournis',
        'instructions': 'Instructions',
        'follow_steps': 'Suivez les étapes fournies par le chef IA ci-dessus.',
        'ai_note': '🤖 Généré par IA : Cette recette a été créée par IA basée sur vos ingrédients. Les temps de cuisson et résultats peuvent varier.',
        'demo_mode': '⚠️ Mode Démo : Connectez votre clé API Gemini pour obtenir de vraies recettes générées par IA.',
        'demo_recipe': 'Recette Démo',
        'cook_time': 'mins cuisson',
        'prep_time': 'mins préparation',
        'serves': 'Sert',
        'difficulty': 'Difficulté',
        'creating_recipe': 'Création de la recette...',
        'enter_ingredients': 'Veuillez saisir quelques ingrédients !',
        'error_recipe': 'Erreur lors de la génération de la recette. Veuillez réessayer.',
        'no_ingredients': 'Veuillez saisir quelques ingrédients !',
        'ingredients_required': 'Veuillez saisir quelques ingrédients !'
      },
      'de': {
        'ingredients_label': 'Welche Zutaten haben Sie?',
        'ingredients_placeholder': 'Hähnchen, Reis, Tomaten, Zwiebeln...',
        'generate_btn': 'Rezept Generieren',
        'generating': 'Generiere...',
        'recipe_title': 'Ihr Rezept',
        'new_recipe': '← Neues Rezept',
        'ai_generated': 'KI-Generiert',
        'ingredients_from_kitchen': 'Zutaten (aus Ihrer Küche)',
        'ingredients_uses': 'Dieses Rezept verwendet die Zutaten, die Sie angegeben haben',
        'instructions': 'Anweisungen',
        'follow_steps': 'Folgen Sie den oben vom KI-Koch bereitgestellten Schritten.',
        'ai_note': '🤖 KI-Generiert: Dieses Rezept wurde von KI basierend auf Ihren Zutaten erstellt. Kochzeiten und Ergebnisse können variieren.',
        'demo_mode': '⚠️ Demo-Modus: Verbinden Sie Ihren Gemini API-Schlüssel, um echte KI-generierte Rezepte zu erhalten.',
        'demo_recipe': 'Demo-Rezept',
        'cook_time': 'Min Kochen',
        'prep_time': 'Min Vorbereitung',
        'serves': 'Sertiert',
        'difficulty': 'Schwierigkeit',
        'creating_recipe': 'Rezept wird erstellt...',
        'enter_ingredients': 'Bitte geben Sie einige Zutaten ein!',
        'error_recipe': 'Fehler beim Generieren des Rezepts. Bitte versuchen Sie es erneut.',
        'no_ingredients': 'Bitte geben Sie einige Zutaten ein!',
        'ingredients_required': 'Bitte geben Sie einige Zutaten ein!'
      },
      'it': {
        'ingredients_label': 'Quali ingredienti hai?',
        'ingredients_placeholder': 'pollo, riso, pomodori, cipolle...',
        'generate_btn': 'Genera Ricetta',
        'generating': 'Generazione...',
        'recipe_title': 'La Tua Ricetta',
        'new_recipe': '← Nuova ricetta',
        'ai_generated': 'Generato da AI',
        'ingredients_from_kitchen': 'Ingredienti (dalla tua cucina)',
        'ingredients_uses': 'Questa ricetta utilizza gli ingredienti che hai fornito',
        'instructions': 'Istruzioni',
        'follow_steps': 'Segui i passaggi forniti dal cuoco AI sopra.',
        'ai_note': '🤖 Generato da AI: Questa ricetta è stata creata da AI basata sui tuoi ingredienti. I tempi di cottura e i risultati possono variare.',
        'demo_mode': '⚠️ Modalità Demo: Collega la tua chiave API Gemini per ottenere vere ricette generate da AI.',
        'demo_recipe': 'Ricetta Demo',
        'cook_time': 'min cottura',
        'prep_time': 'min preparazione',
        'serves': 'Serve',
        'difficulty': 'Difficoltà',
        'creating_recipe': 'Creazione ricetta...',
        'enter_ingredients': 'Per favore inserisci alcuni ingredienti!',
        'error_recipe': 'Errore nella generazione della ricetta. Per favore riprova.',
        'no_ingredients': 'Per favore inserisci alcuni ingredienti!',
        'ingredients_required': 'Per favore inserisci alcuni ingredienti!'
      },
      'pt': {
        'ingredients_label': 'Que ingredientes você tem?',
        'ingredients_placeholder': 'frango, arroz, tomates, cebolas...',
        'generate_btn': 'Gerar Receita',
        'generating': 'Gerando...',
        'recipe_title': 'Sua Receita',
        'new_recipe': '← Nova receita',
        'ai_generated': 'Gerado por IA',
        'ingredients_from_kitchen': 'Ingredientes (da sua cozinha)',
        'ingredients_uses': 'Esta receita usa os ingredientes que você forneceu',
        'instructions': 'Instruções',
        'follow_steps': 'Siga os passos fornecidos pelo chef IA acima.',
        'ai_note': '🤖 Gerado por IA: Esta receita foi criada por IA baseada nos seus ingredientes. Os tempos de cozimento e resultados podem variar.',
        'demo_mode': '⚠️ Modo Demo: Conecte sua chave API Gemini para obter receitas reais geradas por IA.',
        'demo_recipe': 'Receita Demo',
        'cook_time': 'min cozimento',
        'prep_time': 'min preparação',
        'serves': 'Serve',
        'difficulty': 'Dificuldade',
        'creating_recipe': 'Criando receita...',
        'enter_ingredients': 'Por favor digite alguns ingredientes!',
        'error_recipe': 'Erro ao gerar receita. Por favor tente novamente.',
        'no_ingredients': 'Por favor digite alguns ingredientes!',
        'ingredients_required': 'Por favor digite alguns ingredientes!'
      },
      'ru': {
        'ingredients_label': 'Какие ингредиенты у вас есть?',
        'ingredients_placeholder': 'курица, рис, помидоры, лук...',
        'generate_btn': 'Сгенерировать Рецепт',
        'generating': 'Генерация...',
        'recipe_title': 'Ваш Рецепт',
        'new_recipe': '← Новый рецепт',
        'ai_generated': 'Сгенерировано ИИ',
        'ingredients_from_kitchen': 'Ингредиенты (из вашей кухни)',
        'ingredients_uses': 'Этот рецепт использует ингредиенты, которые вы предоставили',
        'instructions': 'Инструкции',
        'follow_steps': 'Следуйте шагам, предоставленным ИИ-шефом выше.',
        'ai_note': '🤖 Сгенерировано ИИ: Этот рецепт был создан ИИ на основе ваших ингредиентов. Время приготовления и результаты могут варьироваться.',
        'demo_mode': '⚠️ Демо-режим: Подключите свой ключ API Gemini, чтобы получить настоящие рецепты, созданные ИИ.',
        'demo_recipe': 'Демо-рецепт',
        'cook_time': 'мин приготовление',
        'prep_time': 'мин подготовка',
        'serves': 'Порций',
        'difficulty': 'Сложность',
        'creating_recipe': 'Создание рецепта...',
        'enter_ingredients': 'Пожалуйста, введите несколько ингредиентов!',
        'error_recipe': 'Ошибка при генерации рецепта. Пожалуйста, попробуйте еще раз.',
        'no_ingredients': 'Пожалуйста, введите несколько ингредиентов!',
        'ingredients_required': 'Пожалуйста, введите несколько ингредиентов!'
      },
      'ja': {
        'ingredients_label': 'どんな食材がありますか？',
        'ingredients_placeholder': '鶏肉、ご飯、トマト、玉ねぎ...',
        'generate_btn': 'レシピを生成',
        'generating': '生成中...',
        'recipe_title': 'あなたのレシピ',
        'new_recipe': '← 新しいレシピ',
        'ai_generated': 'AI生成',
        'ingredients_from_kitchen': '食材（あなたのキッチンから）',
        'ingredients_uses': 'このレシピはあなたが提供した食材を使用します',
        'instructions': '手順',
        'follow_steps': '上のAIシェフが提供した手順に従ってください。',
        'ai_note': '🤖 AI生成：このレシピはあなたの食材に基づいてAIによって作成されました。調理時間と結果は変動する可能性があります。',
        'demo_mode': '⚠️ デモモード：Gemini APIキーを接続して、本物のAI生成レシピを取得してください。',
        'demo_recipe': 'デモレシピ',
        'cook_time': '分 調理',
        'prep_time': '分 準備',
        'serves': '人分',
        'difficulty': '難易度',
        'creating_recipe': 'レシピを作成中...',
        'enter_ingredients': 'いくつかの食材を入力してください！',
        'error_recipe': 'レシピの生成でエラーが発生しました。再試行してください。',
        'no_ingredients': 'いくつかの食材を入力してください！',
        'ingredients_required': 'いくつかの食材を入力してください！'
      },
      'ko': {
        'ingredients_label': '어떤 재료가 있나요?',
        'ingredients_placeholder': '닭고기, 쌀, 토마토, 양파...',
        'generate_btn': '레시피 생성',
        'generating': '생성 중...',
        'recipe_title': '당신의 레시피',
        'new_recipe': '← 새 레시피',
        'ai_generated': 'AI 생성',
        'ingredients_from_kitchen': '재료 (주방에서)',
        'ingredients_uses': '이 레시피는 당신이 제공한 재료를 사용합니다',
        'instructions': '지침',
        'follow_steps': '위의 AI 셰프가 제공한 단계를 따르세요.',
        'ai_note': '🤖 AI 생성: 이 레시피는 당신의 재료를 기반으로 AI에 의해 생성되었습니다. 조리 시간과 결과는 다를 수 있습니다.',
        'demo_mode': '⚠️ 데모 모드: Gemini API 키를 연결하여 실제 AI 생성 레시피를 받으세요.',
        'demo_recipe': '데모 레시피',
        'cook_time': '분 조리',
        'prep_time': '분 준비',
        'serves': '인분',
        'difficulty': '난이도',
        'creating_recipe': '레시피 생성 중...',
        'enter_ingredients': '재료를 입력해주세요!',
        'error_recipe': '레시피 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
        'no_ingredients': '재료를 입력해주세요!',
        'ingredients_required': '재료를 입력해주세요!'
      },
      'zh': {
        'ingredients_label': '您有什么食材？',
        'ingredients_placeholder': '鸡肉、米饭、西红柿、洋葱...',
        'generate_btn': '生成食谱',
        'generating': '生成中...',
        'recipe_title': '您的食谱',
        'new_recipe': '← 新食谱',
        'ai_generated': 'AI生成',
        'ingredients_from_kitchen': '食材（来自您的厨房）',
        'ingredients_uses': '此食谱使用您提供的食材',
        'instructions': '说明',
        'follow_steps': '请按照上面的AI厨师提供的步骤操作。',
        'ai_note': '🤖 AI生成：此食谱基于您的食材由AI创建。烹饪时间和结果可能会有所不同。',
        'demo_mode': '⚠️ 演示模式：连接您的Gemini API密钥以获取真正的AI生成食谱。',
        'demo_recipe': '演示食谱',
        'cook_time': '分钟烹饪',
        'prep_time': '分钟准备',
        'serves': '人份',
        'difficulty': '难度',
        'creating_recipe': '正在创建食谱...',
        'enter_ingredients': '请输入一些食材！',
        'error_recipe': '生成食谱时出错。请重试。',
        'no_ingredients': '请输入一些食材！',
        'ingredients_required': '请输入一些食材！'
      },
      'ar': {
        'ingredients_label': 'ما هي المكونات التي لديك؟',
        'ingredients_placeholder': 'دجاج، أرز، طماطم، بصل...',
        'generate_btn': 'إنشاء وصفة',
        'generating': 'جاري الإنشاء...',
        'recipe_title': 'وصفتك',
        'new_recipe': '← وصفة جديدة',
        'ai_generated': 'تم إنشاؤها بواسطة الذكاء الاصطناعي',
        'ingredients_from_kitchen': 'المكونات (من مطبخك)',
        'ingredients_uses': 'هذه الوصفة تستخدم المكونات التي قدمتها',
        'instructions': 'التعليمات',
        'follow_steps': 'اتبع الخطوات التي قدمها طاهي الذكاء الاصطناعي أعلاه.',
        'ai_note': '🤖 تم إنشاؤها بواسطة الذكاء الاصطناعي: تم إنشاء هذه الوصفة بواسطة الذكاء الاصطناعي بناءً على مكوناتك. قد تختلف أوقات الطبخ والنتائج.',
        'demo_mode': '⚠️ وضع تجريبي: قم بتوصيل مفتاح Gemini API الخاص بك للحصول على وصفات حقيقية مولدة بالذكاء الاصطناعي.',
        'demo_recipe': 'وصفة تجريبية',
        'cook_time': 'دقيقة طبخ',
        'prep_time': 'دقيقة إعداد',
        'serves': 'يخدم',
        'difficulty': 'صعوبة',
        'creating_recipe': 'إنشاء الوصفة...',
        'enter_ingredients': 'يرجى إدخال بعض المكونات!',
        'error_recipe': 'خطأ في إنشاء الوصفة. يرجى المحاولة مرة أخرى.',
        'no_ingredients': 'يرجى إدخال بعض المكونات!',
        'ingredients_required': 'يرجى إدخال بعض المكونات!'
      },
      'hi': {
        'ingredients_label': 'आपके पास कौन से सामग्री हैं?',
        'ingredients_placeholder': 'चिकन, चावल, टमाटर, प्याज...',
        'generate_btn': 'रेसिपी बनाएं',
        'generating': 'बन रहा है...',
        'recipe_title': 'आपकी रेसिपी',
        'new_recipe': '← नई रेसिपी',
        'ai_generated': 'AI द्वारा बनाया गया',
        'ingredients_from_kitchen': 'सामग्री (आपके किचन से)',
        'ingredients_uses': 'यह रेसिपी आपके द्वारा प्रदान की गई सामग्री का उपयोग करती है',
        'instructions': 'निर्देश',
        'follow_steps': 'ऊपर AI शेफ द्वारा प्रदान किए गए चरणों का पालन करें।',
        'ai_note': '🤖 AI द्वारा बनाया गया: यह रेसिपी आपके सामग्री के आधार पर AI द्वारा बनाई गई थी। खाना पकाने का समय और परिणाम भिन्न हो सकते हैं।',
        'demo_mode': '⚠️ डेमो मोड: वास्तविक AI-जनित रेसिपी प्राप्त करने के लिए अपना Gemini API कुंजी कनेक्ट करें।',
        'demo_recipe': 'डेमो रेसिपी',
        'cook_time': 'मिनट पकाना',
        'prep_time': 'मिनट तैयारी',
        'serves': 'परोसता है',
        'difficulty': 'कठिनाई',
        'creating_recipe': 'रेसिपी बन रही है...',
        'enter_ingredients': 'कृपया कुछ सामग्री दर्ज करें!',
        'error_recipe': 'रेसिपी बनाने में त्रुटि। कृपया पुनः प्रयास करें।',
        'no_ingredients': 'कृपया कुछ सामग्री दर्ज करें!',
        'ingredients_required': 'कृपया कुछ सामग्री दर्ज करें!'
      },
      'ur': {
        'ingredients_label': 'آپ کے پاس کون سی اجزاء ہیں؟',
        'ingredients_placeholder': 'چکن, چاول, ٹماٹر, پیاز...',
        'generate_btn': 'نسخہ بنائیں',
        'generating': 'بن رہا ہے...',
        'recipe_title': 'آپ کی ترکیب',
        'new_recipe': '← نئی ترکیب',
        'ai_generated': 'AI کی طرف سے بنایا گیا',
        'ingredients_from_kitchen': 'اجزاء (آپ کے کچن سے)',
        'ingredients_uses': 'یہ نسخہ آپ کی فراہم کردہ اجزاء استعمال کرتا ہے',
        'instructions': 'ہدایات',
        'follow_steps': 'اوپر AI شیف کی طرف سے فراہم کردہ مراحل پر عمل کریں۔',
        'ai_note': '🤖 AI کی طرف سے بنایا گیا: یہ نسخہ آپ کی اجزاء کی بنیاد پر AI کی طرف سے بنایا گیا تھا۔ کھانا پکانے کا وقت اور نتائج مختلف ہو سکتے ہیں۔',
        'demo_mode': '⚠️ ڈیمو موڈ: حقیقی AI سے تیار کردہ نسخے حاصل کرنے کے لیے اپنی Gemini API کلید جوڑیں۔',
        'demo_recipe': 'ڈیمو نسخہ',
        'cook_time': 'منٹ پکانا',
        'prep_time': 'منٹ تیاری',
        'serves': 'سرو کرتا ہے',
        'difficulty': 'مشکل',
        'creating_recipe': 'نسخہ بن رہا ہے...',
        'enter_ingredients': 'براہ کرم کچھ اجزاء درج کریں!',
        'error_recipe': 'نسخہ بنانے میں خرابی۔ براہ کرم دوبارہ کوشش کریں۔',
        'no_ingredients': 'براہ کرم کچھ اجزاء درج کریں!',
        'ingredients_required': 'براہ کرم کچھ اجزاء درج کریں!'
      },
      'sd': {
        'ingredients_label': 'توھان وٽ ڪھڙيون شيون آھن؟',
        'ingredients_placeholder': 'چڪن، چانور، ٽماٽا، گاجر...',
        'generate_btn': 'ترڪيب ٺاھيو',
        'generating': 'ٺاھي رھيو آھي...',
        'recipe_title': 'توھان جي ترڪيب',
        'new_recipe': '← نئين ترڪيب',
        'ai_generated': 'AI سان ٺاھيل',
        'ingredients_from_kitchen': 'شيون (توھان جي باورچی خانه مان)',
        'ingredients_uses': 'ھيءَ ترڪيب توھان جي ڏنل شين کي استعمال ڪري ٿي',
        'instructions': 'ھدايتون',
        'follow_steps': 'مٿي AI شيف جي ڏنل قدمن تي عمل ڪريو۔',
        'ai_note': '🤖 AI سان ٺاھيل: ھيءَ ترڪيب توھان جي شين جي بنياد تي AI سان ٺاھي وئي ھئي۔ کھاڻي پچائڻ جو وقت ۽ نتيجا مختلف ٿي سگهن ٿا۔',
        'demo_mode': '⚠️ ڊيمو موڊ: حقيقي AI سان ٺاھيل ترڪيبون حاصل ڪرڻ لاءِ پنھنجي Gemini API ڪنجي ڳنڍيو۔',
        'demo_recipe': 'ڊيمو ترڪيب',
        'cook_time': 'منٽ پچائڻ',
        'prep_time': 'منٽ تياري',
        'serves': 'سرو ڪري ٿو',
        'difficulty': 'مشڪل',
        'creating_recipe': 'ترڪيب ٺاھي رھي آھي...',
        'enter_ingredients': 'مھرباني ڪري ڪجھ شيون داخل ڪريو!',
        'error_recipe': 'ترڪيب ٺاھڻ ۾ خرابي۔ مھرباني ڪري ٻيهر ڪوشش ڪريو۔',
        'no_ingredients': 'مھرباني ڪري ڪجھ شيون داخل ڪريو!',
        'ingredients_required': 'مھرباني ڪري ڪجھ شيون داخل ڪريو!'
      }
    };

    let currentLanguage = 'en';

    // Translation function
    function translate(key) {
      return translations[currentLanguage][key] || translations['en'][key] || key;
    }

    // Update all translatable elements
    function updateTranslations() {
      document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translate(key);
        } else {
          element.textContent = translate(key);
        }
      });
    }

    // Language selector event listener
    document.getElementById('languageSelect').addEventListener('change', function() {
      currentLanguage = this.value;
      updateTranslations();

      // Update HTML lang attribute
      document.documentElement.lang = currentLanguage;

      // Store preference in localStorage
      localStorage.setItem('recipeGeneratorLanguage', currentLanguage);
    });

    // Load saved language preference
    window.addEventListener('load', function() {
      const savedLanguage = localStorage.getItem('recipeGeneratorLanguage');
      if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
        document.getElementById('languageSelect').value = currentLanguage;
        document.documentElement.lang = currentLanguage;
        updateTranslations();
      }
    });

    document.getElementById('recipeForm').addEventListener('submit', async function(e) {
      e.preventDefault();

      const ingredients = document.getElementById('ingredients').value;

      if (!ingredients.trim()) {
        alert('Please enter some ingredients!');
        return;
      }

      // Show loading state
      document.getElementById('loadingOverlay').classList.remove('hidden');
      document.getElementById('btnText').textContent = 'Generating...';

      try {
        // TODO: Implement API call to generate recipe
        // For now, we'll show a demo recipe
        await generateDemoRecipe(ingredients);
      } catch (error) {
        console.error('Error generating recipe:', error);
        alert('Error generating recipe. Please try again.');
      } finally {
        // Hide loading state
        document.getElementById('loadingOverlay').classList.add('hidden');
        document.getElementById('btnText').textContent = 'Generate Recipe';
      }
    });

    document.getElementById('newRecipeBtn').addEventListener('click', function() {
      document.getElementById('recipeSection').classList.add('hidden');
      document.getElementById('ingredients').value = '';
    });

    async function generateDemoRecipe(ingredients) {
      try {
        // Make API call to the backend
        const formData = new FormData();
        formData.append('ingredients', ingredients);
        formData.append('language', currentLanguage);

        const response = await fetch('/api/recipe/generate', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Use the first recipe from the API response
        const recipe = Array.isArray(data) ? data[0] : data;

        displayRecipe(recipe);

      } catch (error) {
        console.error('API Error:', error);
        // Fallback to demo recipe if API fails
        displayFallbackRecipe(ingredients);
      }
    }

    function displayRecipe(recipe) {
      const recipeContent = document.getElementById('recipeContent');

      // Use generated image if available, otherwise use external service or fallback
      const imageUrl = recipe.generated_image_path ?
        recipe.generated_image_path :
        (recipe.prompt_for_image ?
          `https://image.pollinations.ai/prompt/${encodeURIComponent(recipe.prompt_for_image)}` :
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop");

      recipeContent.innerHTML = `
        <div class="space-y-8">
          <!-- Recipe Image -->
          <div class="text-center">
            <img src="${imageUrl}" alt="${recipe.recipe_name}"
                 class="w-full max-w-sm mx-auto rounded-lg"
                 onerror="this.src='https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop'">
          </div>

          <!-- Recipe Header -->
          <div class="text-center">
            <h3 class="text-2xl font-medium text-gray-900 mb-2">${recipe.recipe_name}</h3>
            <div class="flex justify-center space-x-6 text-sm text-gray-600">
              <span>${recipe.cooking_time_in_minutes || 30} mins cook</span>
              <span>AI Generated</span>
            </div>
          </div>

          <!-- Ingredients -->
          <div>
            <h4 class="text-lg font-medium text-gray-900 mb-4">Ingredients (from your kitchen)</h4>
            <p class="text-gray-600 mb-4">This recipe uses the ingredients you provided</p>
          </div>

          <!-- Instructions -->
          <div>
            <h4 class="text-lg font-medium text-gray-900 mb-4">Instructions</h4>
            <ol class="space-y-4">
              ${recipe.steps ? recipe.steps.map((instruction, index) => `
                <li class="flex space-x-4">
                  <span class="flex-shrink-0 w-6 h-6 bg-gray-900 text-white text-sm rounded-full flex items-center justify-center font-medium">${index + 1}</span>
                  <span class="text-gray-700 leading-relaxed">${instruction}</span>
                </li>
              `).join('') : '<li class="text-gray-700">Follow the steps provided by the AI chef above.</li>'}
            </ol>
          </div>

          <!-- AI Note -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-800">
              <strong>🤖 AI Generated:</strong> This recipe was created by AI based on your ingredients.
              Cooking times and results may vary.
            </p>
          </div>
        </div>
      `;

      // Show recipe section
      document.getElementById('recipeSection').classList.remove('hidden');
    }

    function displayFallbackRecipe(ingredients) {
      // Fallback demo recipe if API fails
      const recipeContent = document.getElementById('recipeContent');

      const demoRecipe = {
        title: "Simple Chicken Stir-Fry",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
        instructions: [
          "Heat oil in a pan over medium heat",
          "Add garlic and cook until fragrant (30 seconds)",
          "Add chicken and cook until browned",
          "Add vegetables and stir-fry for 3-4 minutes",
          "Add soy sauce and cook for another 2 minutes",
          "Serve over rice or noodles"
        ]
      };

      recipeContent.innerHTML = `
        <div class="space-y-8">
          <!-- Recipe Image -->
          <div class="text-center">
            <img src="${demoRecipe.image}" alt="${demoRecipe.title}"
                 class="w-full max-w-sm mx-auto rounded-lg">
          </div>

          <!-- Recipe Header -->
          <div class="text-center">
            <h3 class="text-2xl font-medium text-gray-900 mb-2">${demoRecipe.title}</h3>
            <div class="flex justify-center space-x-6 text-sm text-gray-600">
              <span>15 mins cook</span>
              <span>Demo Recipe</span>
            </div>
          </div>

          <!-- Ingredients -->
          <div>
            <h4 class="text-lg font-medium text-gray-900 mb-4">Ingredients (from your kitchen)</h4>
            <p class="text-gray-600 mb-4">This recipe uses: ${ingredients}</p>
          </div>

          <!-- Instructions -->
          <div>
            <h4 class="text-lg font-medium text-gray-900 mb-4">Instructions</h4>
            <ol class="space-y-4">
              ${demoRecipe.instructions.map((instruction, index) => `
                <li class="flex space-x-4">
                  <span class="flex-shrink-0 w-6 h-6 bg-gray-900 text-white text-sm rounded-full flex items-center justify-center font-medium">${index + 1}</span>
                  <span class="text-gray-700 leading-relaxed">${instruction}</span>
                </li>
              `).join('')}
            </ol>
          </div>

          <!-- Demo Note -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p class="text-sm text-yellow-800">
              <strong>⚠️ Demo Mode:</strong> Connect your Gemini API key to get real AI-generated recipes.
            </p>
          </div>
        </div>
      `;

      // Show recipe section
      document.getElementById('recipeSection').classList.remove('hidden');
    }
  </script>
</body>

</html>