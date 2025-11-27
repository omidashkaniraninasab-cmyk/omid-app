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
              پلتفرم پیشرفته مدیریت هویت دیجیتال برای متخصصان
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
              تمام ابزارهای مورد نیاز برای مدیریت حرفه‌ای هویت دیجیتال
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
                icon: "⚡", 
                title: "عملکرد بالا",
                description: "بارگذاری آنی و تجربه کاربری بی‌نظیر",
                color: "blue"
              },
              {
                icon: "🎯",
                title: "تحلیل پیشرفته",
                description: "گزارش‌های دقیق از فعالیت‌های کاربران",
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}