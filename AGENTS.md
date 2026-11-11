# 🦁 Afyon Ev Lezzetleri — Yazılım Geliştirme ve Mimari Kılavuzu (AGENTS.md)

Bu belge, **Afyon Ev Lezzetleri** projesinde görev alacak yapay zeka (AI) geliştiricilerinin uymak zorunda olduğu mutlak mimari kuralları, iş disiplinini ve kod standartlarını içerir. Proje sahibi ve baş geliştirici olan **Abi**'nin onayı olmadan bu kuralların dışına kesinlikle çıkılamaz.

---

## 🎯 1. Temel Geliştirme İlkeleri ve İş Disiplini

### Önce Abi'ye Sor & Onay Al
* Sistemde tespit edilen hatalar veya yapılması gereken değişiklikler için **doğrudan kod müdahalesi yapılmayacaktır.**
* Önce durum analiz edilecek, teknik jargondan uzak, net ve sade bir dille Abi'ye raporlanacaktır. Kendisinden onay alındıktan sonra geliştirme aşamasına geçilecektir.

### İşlem Öncesi Kısa Ön Bilgi Verme Kuralı (Sistem Çorba Olmasın)
* Yapay zeka ajanları herhangi bir dosyada değişiklik veya kod müdahalesi yapmadan önce, **ne yapacağını ve hangi dosyayı etkileyeceğini 1-2 cümlelik çok kısa ve net bir ön bilgiyle** Abi'ye bildirecektir. Habersiz ve kontrolsüz işlem kesinlikle yasaktır.

### Kesin Sistem ve Rol Ayrımı (Müşteri & Yönetim İzolasyonu)
* Sistem iki ana dünyaya ayrılmıştır: **Müşteri Dünyası** ve **Yönetim/Operasyon Dünyası** (Ev Mutfağı, Ticari Restoran, Kurye, Admin/Patron).
* Müşteri kayıt, giriş ve vitrin akışlarına diğer roller (Mutfak, Restoran, Kurye vb.) kesinlikle karıştırılmayacak; roller ve arayüzler birbirinden tamamen izole tutulacaktır.

### %100 Türkçe Kodlama Standardı
* Proje genelinde kafa karışıklığını önlemek adına **tüm yeni klasör isimleri, dosya isimleri, değişken ve fonksiyon isimleri tamamen Türkçe** olacaktır. 

### Modüler Yapı ve Sorumlulukların Ayrılması
* Görsel arayüz (Tasarım/Kumaş) ile veritabanı işçiliği (İskelet/Mantık) asla aynı dosyada bulunamaz.
* **Tek Dosya - Tek İş prensibi** esastır. Bir dosya sadece tek bir görevden sorumlu olacak ve boyutu **50-60 satırı geçtiği an** mantıksal parçalara bölünecektir.

### Statik Veri Yönetimi
* Bileşenlerin (component), sayfaların veya çekmecelerin içerisine geçici/statik veri yazılması **kesinlikle yasaktır.**
* Test ve geliştirme aşamasında kullanılacak tüm sahte veriler (mutfaklar, yemekler, müşteriler, kampanyalar) tek bir merkezde toplanacaktır: `src/veritabani/GeciciTestDeposu.ts`
* Canlıya geçiş esnasında bu dosya tek bir hamleyle devre dışı bırakılacak şekilde kurgulanacaktır.


---

## 🗂️ 2. Mimari Yapı ve Klasör Düzeni

Projenin dizin mimarisi, sorumlulukların tam olarak ayrılması amacıyla **4 ana odadan (bölümden)** oluşur:

### 1. Giriş Kapısı (`src/GirisKapisi/`)
* Projenin giriş ve yönlendirme merkezidir. Ağır iş mantığı barındırmaz; kullanıcıyı ilgili sayfalara güvenli şekilde yönlendirir.

### 2. Malzeme Çekmeceleri (`src/MalzemeCekmeceleri/` - Hooks)
* Görsel arayüzü olmayan, arka planda veri transferini yöneten işçiler odasıdır. 
* Supabase entegrasyonu ve veri çekme işlemleri bu odada, her iş grubu için ayrı bir Türkçe dosya altında toplanır. Test modunda veriyi doğrudan `GeciciTestDeposu.ts` üzerinden çeker.

### 3. Ortak Havuz (`src/OrtakHavuz/` - Context)
* Sayfa değişikliklerinde dükkanın hafızasında kalması gereken küresel durumları yönetir. Kullanıcı oturum bilgileri ve müşteri sepeti gibi büyük operasyonlar burada saklanır.

### 4. Vitrin Odası (`src/VitrinOdasi/` - Pages/Components)
* Müşterinin doğrudan etkileşime girdiği arayüz elementleridir. Kart tasarımları, butonlar, listeler ve ana sayfa vitrini tamamen bu odada modüler olarak inşa edilir.

---

## 📢 3. İletişim ve Raporlama Standardı

* **Net ve Sonuç Odaklı:** İletişimde laf dolandırılmayacak; giriş, gelişme ve çıkış dengesi korunarak doğrudan teknik analiz sunulacaktır.
* **Hiyerarşiye Saygı:** Yapay zeka sistemi bir uygulayıcıdır; mimari kararlar, onaylar ve yönlendirmeler tamamen Abi'nin yetkisindedir.
