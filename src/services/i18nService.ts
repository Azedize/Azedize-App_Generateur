import { Translation } from '../types';

export const translations: Translation = {
  // Navigation
  nav_generator: { en: 'Generator', ar: 'المولد', fr: 'Générateur' },
  nav_vault: { en: 'Secure Vault', ar: 'الخزنة الآمنة', fr: 'Coffre sécurisé' },
  nav_analyzer: { en: 'Health Check', ar: 'فحص كلمة المرور', fr: 'Vérification' },
  nav_tools: { en: 'Security Tools', ar: 'أدوات الأمان', fr: 'Outils de sécurité' },
  nav_audit: { en: 'Audit Dashboard', ar: 'لوحة التدقيق', fr: 'Audit' },
  nav_advisor: { en: 'AI Advisor', ar: 'مستشار الذكاء الاصطناعي', fr: 'Conseiller IA' },
  nav_logout: { en: 'Lock App', ar: 'قفل التطبيق', fr: 'Verrouiller' },

  // Generator
  gen_title: { en: 'Password Generator', ar: 'مولد كلمات المرور', fr: 'Générateur de mot de passe' },
  gen_mode_random: { en: 'Random', ar: 'عشوائي', fr: 'Aléatoire' },
  gen_mode_phrase: { en: 'Passphrase', ar: 'عبارة مرور', fr: 'Phrase secrète' },
  gen_mode_pin: { en: 'PIN', ar: 'رمز PIN', fr: 'Code PIN' },
  gen_length: { en: 'Length', ar: 'الطول', fr: 'Longueur' },
  gen_words: { en: 'Word Count', ar: 'عدد الكلمات', fr: 'Nombre de mots' },
  gen_separator: { en: 'Separator', ar: 'الفاصل', fr: 'Séparateur' },
  gen_uppercase: { en: 'Include Uppercase', ar: 'أحرف كبيرة', fr: 'Majuscules' },
  gen_lowercase: { en: 'Include Lowercase', ar: 'أحرف صغيرة', fr: 'Minuscules' },
  gen_numbers: { en: 'Include Numbers', ar: 'أرقام', fr: 'Chiffres' },
  gen_symbols: { en: 'Include Symbols', ar: 'رموز', fr: 'Symboles' },
  gen_ambiguous: { en: 'Super Secure (Ambiguous Chars)', ar: 'أمان فائق (رموز غامضة)', fr: 'Super sécurisé (Ambigu)' },
  gen_generate: { en: 'Generate New', ar: 'توليد جديد', fr: 'Générer' },
  gen_copy: { en: 'Copy', ar: 'نسخ', fr: 'Copier' },

  // Tools
  tool_hash: { en: 'Hash Generator', ar: 'مولد التجزئة', fr: 'Générateur de Hash' },
  tool_uuid: { en: 'UUID Generator', ar: 'مولد UUID', fr: 'Générateur UUID' },
  tool_user: { en: 'Username Gen', ar: 'مولد أسماء المستخدمين', fr: 'Générateur Pseudo' },
  tool_api: { en: 'API Key Gen', ar: 'مولد مفاتيح API', fr: 'Clés API' },
  tool_input: { en: 'Input Text', ar: 'النص المدخل', fr: 'Texte' },
  tool_output: { en: 'Output', ar: 'الناتج', fr: 'Sortie' },
  tool_algo: { en: 'Algorithm', ar: 'الخوارزمية', fr: 'Algorithme' },

  // Vault
  vault_title: { en: 'Encrypted Vault', ar: 'الخزنة المشفرة', fr: 'Coffre Chiffré' },
  vault_type_login: { en: 'Login', ar: 'تسجيل دخول', fr: 'Connexion' },
  vault_type_note: { en: 'Note', ar: 'ملاحظة', fr: 'Note' },
  vault_add: { en: 'Add Item', ar: 'إضافة عنصر', fr: 'Ajouter' },
  vault_empty: { en: 'Vault is empty.', ar: 'الخزنة فارغة.', fr: 'Coffre vide.' },
  vault_locked_title: { en: 'Access Restricted', ar: 'الدخول مقيد', fr: 'Accès restreint' },
  vault_enter_master: { en: 'Enter Master Password', ar: 'أدخل كلمة المرور الرئيسية', fr: 'Entrez le mot de passe' },
  vault_unlock: { en: 'Decrypt & Unlock', ar: 'فك التشفير وفتح', fr: 'Déchiffrer & Ouvrir' },
  vault_setup_title: { en: 'Vault Setup', ar: 'إعداد الخزنة', fr: 'Configuration' },
  vault_setup_desc: { en: 'Set a master password. This key encrypts your data locally using AES-GCM. We cannot recover it if lost.', ar: 'عيّن كلمة مرور رئيسية. هذا المفتاح يشفر بياناتك محليًا. لا يمكننا استعادتها إذا فقدت.', fr: 'Définissez un mot de passe maître. Il chiffre vos données localement. Perte = Données perdues.' },
  vault_create: { en: 'Initialize Vault', ar: 'تهيئة الخزنة', fr: 'Initialiser' },
  vault_tab_all: { en: 'All', ar: 'الكل', fr: 'Tout' },
  vault_tab_logins: { en: 'Logins', ar: 'الدخول', fr: 'Connexions' },
  vault_tab_notes: { en: 'Notes', ar: 'ملاحظات', fr: 'Notes' },

  // Analyzer
  analyze_title: { en: 'Password Health', ar: 'صحة كلمة المرور', fr: 'Santé du MDP' },
  analyze_placeholder: { en: 'Enter password to check...', ar: 'أدخل كلمة المرور للفحص...', fr: 'Entrez un mot de passe...' },
  analyze_breach_check: { en: 'Scanning breach databases...', ar: 'فحص قواعد بيانات التسريب...', fr: 'Scan des fuites...' },
  analyze_breached: { en: 'Compromised! Found in breaches.', ar: 'مكشوفة! وجدت في التسريبات.', fr: 'Compromis ! Trouvé dans des fuites.' },
  analyze_safe: { en: 'No breaches found.', ar: 'لم يتم العثور على تسريبات.', fr: 'Aucune fuite trouvée.' },
  analyze_req_title: { en: 'Security Requirements', ar: 'متطلبات الأمان', fr: 'Exigences de sécurité' },
  
  req_length: { en: '12+ Characters', ar: '12+ حرف', fr: '12+ Caractères' },
  req_upper: { en: 'Uppercase (A-Z)', ar: 'أحرف كبيرة', fr: 'Majuscules' },
  req_lower: { en: 'Lowercase (a-z)', ar: 'أحرف صغيرة', fr: 'Minuscules' },
  req_number: { en: 'Numbers (0-9)', ar: 'أرقام', fr: 'Chiffres' },
  req_symbol: { en: 'Symbols (!@#)', ar: 'رموز', fr: 'Symboles' },

  // Common
  lbl_save: { en: 'Save', ar: 'حفظ', fr: 'Enregistrer' },
  lbl_cancel: { en: 'Cancel', ar: 'إلغاء', fr: 'Annuler' },
  lbl_delete: { en: 'Delete', ar: 'حذف', fr: 'Supprimer' },
  lbl_title: { en: 'Title', ar: 'العنوان', fr: 'Titre' },
  lbl_note: { en: 'Note Content', ar: 'محتوى الملاحظة', fr: 'Contenu' },
  lbl_category: { en: 'Category', ar: 'الفئة', fr: 'Catégorie' },
  
  // Advisor
  advisor_title: { en: 'Security Advisor', ar: 'مستشار الأمان', fr: 'Conseiller Sécurité' },
  advisor_desc: { en: 'AI-powered security insights', ar: 'رؤى أمنية مدعومة بالذكاء الاصطناعي', fr: 'Conseils de sécurité IA' },
  advisor_placeholder: { en: 'Ask about security...', ar: 'اسأل عن الأمان...', fr: 'Posez une question...' },

  // Footer
  footer_made: { en: 'Made by', ar: 'تم التطوير بواسطة', fr: 'Réalisé par' },

  // App
  app_subtitle: { en: 'Professional Toolkit', ar: 'مجموعة أدوات احترافية', fr: 'Boîte à outils professionnelle' },
  app_appearance: { en: 'Appearance', ar: 'المظهر', fr: 'Apparence' },

  // Generator
  gen_subtitle: { en: 'Create high-entropy credentials securely locally in your browser.', ar: 'أنشئ بيانات اعتماد عالية الأمان محليًا في متصفحك.', fr: 'Créez des identifiants haute sécurité localement.' },
  gen_copied: { en: 'Copied to clipboard', ar: 'تم النسخ للحافظة', fr: 'Copié dans le presse-papiers' },
  gen_capitalize: { en: 'Capitalize', ar: 'تكبير الحرف الأول', fr: 'Majuscule' },
  gen_include_num: { en: 'Include Number', ar: 'تضمين رقم', fr: 'Inclure un chiffre' },
  gen_space: { en: 'Space', ar: 'مسافة', fr: 'Espace' },

  // Analyzer
  analyze_subtitle: { en: 'Real-time strength evaluation & leak detection.', ar: 'تقييم القوة واكتشاف التسريب في الوقت الفعلي.', fr: 'Évaluation en temps réel et détection de fuites.' },
  analyze_enter: { en: 'Enter Password', ar: 'أدخل كلمة المرور', fr: 'Entrez le mot de passe' },
  analyze_very_weak: { en: 'Very Weak', ar: 'ضعيف جداً', fr: 'Très faible' },
  analyze_weak: { en: 'Weak', ar: 'ضعيف', fr: 'Faible' },
  analyze_fair: { en: 'Fair', ar: 'متوسط', fr: 'Moyen' },
  analyze_good: { en: 'Good', ar: 'جيد', fr: 'Bon' },
  analyze_strong: { en: 'Strong', ar: 'قوي', fr: 'Fort' },
  analyze_found_breach: { en: 'Found in known data breaches.', ar: 'وجدت في تسريبات بيانات معروفة.', fr: 'Trouvé dans des fuites de données.' },
  analyze_no_breach: { en: 'Not found in known public breaches.', ar: 'لم يتم العثور عليها في تسريبات عامة.', fr: 'Non trouvé dans les fuites publiques.' },
  analyze_copy_sugg: { en: 'Copy suggestion', ar: 'نسخ الاقتراح', fr: 'Copier la suggestion' },

  // Vault
  vault_subtitle: { en: 'Manage your secure items securely.', ar: 'أدر عناصرك الآمنة بأمان.', fr: 'Gérez vos éléments sécurisés.' },
  vault_error_min_len: { en: 'Master password must be at least 4 characters.', ar: 'يجب أن تكون كلمة المرور الرئيسية 4 أحرف على الأقل.', fr: 'Le mot de passe maître doit contenir au moins 4 caractères.' },
  vault_error_save: { en: 'Failed to save changes. Please try again.', ar: 'فشل حفظ التغييرات. حاول مرة أخرى.', fr: 'Échec de l\'enregistrement. Réessayez.' },
  vault_error_decrypt: { en: 'Decryption failed. Data might be corrupted.', ar: 'فشل فك التشفير. قد تكون البيانات تالفة.', fr: 'Échec du déchiffrement. Données corrompues ?' },
  vault_error_password: { en: 'Incorrect master password', ar: 'كلمة المرور الرئيسية غير صحيحة', fr: 'Mot de passe maître incorrect' },
  vault_error_session: { en: 'Session expired. Please unlock vault again.', ar: 'انتهت الجلسة. الرجاء فتح الخزنة مرة أخرى.', fr: 'Session expirée. Déverrouillez à nouveau.' },
  vault_confirm_delete: { en: 'Are you sure you want to delete this item?', ar: 'هل أنت متأكد أنك تريد حذف هذا العنصر؟', fr: 'Voulez-vous vraiment supprimer cet élément ?' },
  vault_reset_title: { en: 'Reset Secure Vault?', ar: 'إعادة تعيين الخزنة الآمنة؟', fr: 'Réinitialiser le coffre ?' },
  vault_warning: { en: 'Warning:', ar: 'تحذير:', fr: 'Attention :' },
  vault_reset_desc: { en: 'You are about to wipe your vault. All passwords and notes will be permanently deleted. This cannot be undone.', ar: 'أنت على وشك مسح خزنتك. سيتم حذف جميع كلمات المرور والملاحظات نهائيًا. لا يمكن التراجع عن هذا.', fr: 'Vous allez effacer votre coffre. Tout sera supprimé définitivement.' },
  vault_reset_confirm: { en: 'Yes, Delete Everything', ar: 'نعم، احذف كل شيء', fr: 'Oui, tout supprimer' },
  vault_locked_desc: { en: 'Your data is encrypted locally. Enter your master password to unlock.', ar: 'بياناتك مشفرة محليًا. أدخل كلمة المرور الرئيسية لفتحها.', fr: 'Données chiffrées localement. Entrez le mot de passe maître.' },
  vault_forgot_pass: { en: 'Forgot Master Password?', ar: 'نسيت كلمة المرور الرئيسية؟', fr: 'Mot de passe oublié ?' },
  vault_empty_desc: { en: 'Items you add will appear here securely.', ar: 'العناصر التي تضيفها ستظهر هنا بأمان.', fr: 'Les éléments ajoutés apparaîtront ici.' },
  vault_secure_note: { en: 'Secure Note', ar: 'ملاحظة آمنة', fr: 'Note sécurisée' },
  vault_copy_pass: { en: 'Copy Password', ar: 'نسخ كلمة المرور', fr: 'Copier le mot de passe' },
  vault_copy_note: { en: 'Copy Note', ar: 'نسخ الملاحظة', fr: 'Copier la note' },
  vault_cat_personal: { en: 'Personal', ar: 'شخصي', fr: 'Personnel' },
  vault_cat_work: { en: 'Work', ar: 'عمل', fr: 'Travail' },
  vault_cat_finance: { en: 'Finance', ar: 'مالية', fr: 'Finance' },
  vault_cat_social: { en: 'Social', ar: 'اجتماعي', fr: 'Social' },
  vault_lbl_username: { en: 'Username', ar: 'اسم المستخدم', fr: 'Nom d\'utilisateur' },
  vault_lbl_password: { en: 'Password', ar: 'كلمة المرور', fr: 'Mot de passe' },
  vault_lbl_website: { en: 'Website', ar: 'الموقع الإلكتروني', fr: 'Site Web' },

  // Audit
  audit_no_data: { en: 'No Data Available', ar: 'لا توجد بيانات متاحة', fr: 'Aucune donnée disponible' },
  audit_no_data_desc: { en: 'Add items to your vault to see security insights.', ar: 'أضف عناصر إلى خزنتك لرؤية رؤى الأمان.', fr: 'Ajoutez des éléments pour voir les analyses.' },
  audit_title: { en: 'Security Audit', ar: 'تدقيق الأمان', fr: 'Audit de sécurité' },
  audit_subtitle: { en: 'Overview of your vault health.', ar: 'نظرة عامة على صحة خزنتك.', fr: 'Aperçu de la santé du coffre.' },
  audit_total: { en: 'Total Items', ar: 'إجمالي العناصر', fr: 'Total des éléments' },
  audit_weak: { en: 'Weak Passwords', ar: 'كلمات مرور ضعيفة', fr: 'Mots de passe faibles' },
  audit_reused: { en: 'Reused Passwords', ar: 'كلمات مرور مكررة', fr: 'Mots de passe réutilisés' },
  audit_score: { en: 'Health Score', ar: 'درجة الصحة', fr: 'Score de santé' },
  audit_dist: { en: 'Strength Distribution', ar: 'توزيع القوة', fr: 'Distribution de la force' },
  audit_cats: { en: 'Categories', ar: 'الفئات', fr: 'Catégories' },

  // Advisor
  advisor_intro: { en: 'Hello! I am XPass AI. Ask me about passwords, encryption, or security best practices.', ar: 'مرحباً! أنا XPass AI. اسألني عن كلمات المرور أو التشفير أو أفضل ممارسات الأمان.', fr: 'Bonjour ! Je suis XPass AI. Posez-moi des questions sur la sécurité.' },

  // Tools
  tools_subtitle: { en: 'Developer and security utilities.', ar: 'أدوات المطورين والأمان.', fr: 'Utilitaires pour développeurs.' },
  tools_gen_hash: { en: 'Generate Hash', ar: 'توليد التجزئة', fr: 'Générer le Hash' },
  tools_hash_placeholder: { en: 'Text to hash...', ar: 'النص للتجزئة...', fr: 'Texte à hacher...' },
  tools_uuid_desc: { en: 'Generate industry-standard v4 unique identifiers.', ar: 'توليد معرفات فريدة قياسية v4.', fr: 'Générer des UUID v4 standards.' },
  tools_click_gen: { en: 'Click generate below', ar: 'انقر للتوليد أدناه', fr: 'Cliquez pour générer' },
  tools_gen_uuid: { en: 'Generate New UUID', ar: 'توليد UUID جديد', fr: 'Nouveau UUID' },
  tools_identity_title: { en: 'Random Identity', ar: 'هوية عشوائية', fr: 'Identité aléatoire' },
  tools_gen_user: { en: 'Generate Username', ar: 'توليد اسم مستخدم', fr: 'Générer un pseudo' },
  tools_api_title: { en: 'API Key Generator', ar: 'مولد مفاتيح API', fr: 'Générateur de clé API' },
  tools_entropy: { en: 'Entropy (Bytes)', ar: 'الإنتروبيا (بايت)', fr: 'Entropie (Octets)' },
  tools_api_placeholder: { en: 'Click generate to create a secure key', ar: 'انقر للتوليد لإنشاء مفتاح آمن', fr: 'Cliquez pour générer une clé' },
  tools_gen_key: { en: 'Generate Secure Key', ar: 'توليد مفتاح آمن', fr: 'Générer une clé sécurisée' },

  // Landing Page
  landing_hero: { en: 'Secure Your Digital Life', ar: 'أمّن حياتك الرقمية', fr: 'Sécurisez votre vie numérique' },
  landing_sub: { en: 'The all-in-one professional security toolkit for everyone.', ar: 'مجموعة أدوات الأمان الاحترافية الشاملة للجميع.', fr: 'La boîte à outils de sécurité professionnelle tout-en-un pour tous.' },
  landing_cta: { en: 'Launch App', ar: 'تشغيل التطبيق', fr: 'Lancer l\'application' },
  
  feat_gen: { en: 'Advanced Generator', ar: 'مولد متقدم', fr: 'Générateur avancé' },
  feat_gen_desc: { en: 'Create unbreakable passwords, passphrases, and PINs instantly.', ar: 'أنشئ كلمات مرور وعبارات مرور ورموز PIN غير قابلة للكسر فورًا.', fr: 'Créez instantanément des mots de passe, phrases secrètes et codes PIN incassables.' },
  
  feat_vault: { en: 'Encrypted Vault', ar: 'خزنة مشفرة', fr: 'Coffre chiffré' },
  feat_vault_desc: { en: 'Store credentials locally with AES-256 encryption. Zero knowledge.', ar: 'خزن بيانات الاعتماد محليًا بتشفير AES-256. صفر معرفة.', fr: 'Stockez vos identifiants localement avec le chiffrement AES-256. Zéro connaissance.' },
  
  feat_analyze: { en: 'Health Analysis', ar: 'تحليل الصحة', fr: 'Analyse de santé' },
  feat_analyze_desc: { en: 'Detect weak passwords and check against known data breaches.', ar: 'اكتشف كلمات المرور الضعيفة وتحقق من تسريبات البيانات المعروفة.', fr: 'Détectez les mots de passe faibles et vérifiez les fuites de données connues.' },
  
  feat_tools: { en: 'Dev Tools', ar: 'أدوات المطورين', fr: 'Outils de dév' },
  feat_tools_desc: { en: 'Generate Hashes, UUIDs, API Keys, and fake identities.', ar: 'توليد التجزئة، UUIDs، مفاتيح API، وهويات مزيفة.', fr: 'Générez des hachages, UUID, clés API et fausses identités.' },
};