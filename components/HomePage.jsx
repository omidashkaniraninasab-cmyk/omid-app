import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* هیرو سکشن */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="relative container mx-auto px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* لوگو و برند */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-white font-bold text-xl">O</span>
              </div>
            </div>

            {/* تایتل اصلی */}
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6 leading-tight">
              Omid App
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed font-light max-w-2xl mx-auto">
              پلتفرم پیشرفته مدیریت هویت دیجیتال و سرگرمی‌های هوشمند
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link 
                href="/auth"
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2">
                  شروع کنید
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
              
              <Link 
                href="/games/crossword"
                className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl shadow-green-500/25 hover:shadow-green-500/40 transform hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2">
                  🧩 بازی کراسورد
                  <span className="group-hover:translate-x-1 transition-transform">🎮</span>
                </span>
              </Link>
              
              <Link 
                href="/dashboard"
                className="group border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
              >
                <span className="flex items-center gap-2">
                  مشاهده دمو
                  <span className="group-hover:translate-x-1 transition-transform">↗</span>
                </span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                امنیت پیشرفته
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                طراحی حرفه‌ای
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                بازی‌های هوشمند
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                پشتیبانی ۲۴/۷
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ویژگی‌ها */}
      <section className="relative bg-white/80 backdrop-blur-sm py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              امکانات پیشرفته
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              تمام ابزارهای مورد نیاز برای مدیریت حرفه‌ای هویت دیجیتال و سرگرمی
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🛡️",
                title: "امنیت سازمانی",
                description: "سیستم احراز هویت چندعاملی با رمزنگاری پیشرفته",
                color: "emerald"
              },
              {
                icon: "🧩", 
                title: "بازی‌های هوشمند",
                description: "مجموعه بازی‌های فکری و چالش‌برانگیز",
                color: "green"
              },
              {
                icon: "🎯",
                title: "تحلیل پیشرفته",
                description: "گزارش‌های دقیق از فعالیت‌ها و عملکرد",
                color: "purple"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-sm border border-slate-200 group-hover:shadow-lg group-hover:border-slate-300 transition-all duration-300" />
                
                <div className="relative p-8">
                  <div className={`w-14 h-14 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-2xl flex items-center justify-center shadow-lg shadow-${feature.color}-500/25 mb-6`}>
                    <span className="text-2xl text-white">{feature.icon}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* دکمه بیشتر برای بازی‌ها */}
                  {feature.icon === "🧩" && (
                    <Link 
                      href="/games/crossword"
                      className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      مشاهده بازی‌ها →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* بخش بازی‌ها */}
          <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">بازی‌های در دسترس</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <GameCard 
                title="کراسورد"
                description="چالش روزانه کلمات و معماها"
                icon="🧩"
                href="/games/crossword"
                color="blue"
                status="فعال"
              />
              <GameCard 
                title="چلنج"
                description="مسابقات فصلی و چالش‌های ویژه"
                icon="🎯"
                href="#"
                color="purple"
                status="به زودی"
                disabled
              />
              <GameCard 
                title="مموری کارت"
                description="تمرین حافظه با کارت‌های هوشمند"
                icon="🃏"
                href="#"
                color="green"
                status="به زودی"
                disabled
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// کامپوننت کارت بازی
function GameCard({ title, description, icon, href, color, status, disabled = false }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600'
  }

  const statusColors = {
    فعال: 'bg-green-100 text-green-800',
    'به زودی': 'bg-yellow-100 text-yellow-800'
  }

  const CardContent = () => (
    <div className={`relative group p-6 rounded-2xl border-2 border-slate-200 bg-white hover:shadow-lg transition-all duration-300 ${
      disabled ? 'opacity-60' : 'hover:border-slate-300'
    }`}>
      {/* وضعیت */}
      <div className={`absolute -top-2 right-4 px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status}
      </div>

      {/* آیکون */}
      <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[color]} rounded-2xl flex items-center justify-center shadow-lg mb-4 mx-auto`}>
        <span className="text-2xl text-white">{icon}</span>
      </div>

      {/* محتوا */}
      <h4 className="text-lg font-semibold text-slate-900 text-center mb-2">{title}</h4>
      <p className="text-slate-600 text-sm text-center leading-relaxed">{description}</p>

      {/* دکمه */}
      {!disabled && (
        <div className="mt-4 text-center">
          <span className="inline-flex items-center gap-1 text-blue-600 font-medium text-sm">
            شروع بازی
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      )}
    </div>
  )

  if (disabled) {
    return <CardContent />
  }

  return (
    <Link href={href}>
      <CardContent />
    </Link>
  )
}