'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard({ user }) {
  const [profile, setProfile] = useState(null)
  const [settings, setSettings] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    fetchUserData()
  }, [user])

  const fetchUserData = async () => {
    try {
      // دریافت پروفایل کاربر
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)

      if (profileError) throw profileError

      // اگر پروفایل وجود نداره، ایجادش کن
      if (!profileData || profileData.length === 0) {
        console.log('📝 پروفایل وجود ندارد، در حال ایجاد...')
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              email: user.email,
              username: user.email.split('@')[0],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
        
        if (insertError) throw insertError
        
        // دوباره دریافت کن
        const { data: newProfileData, error: newError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)

        if (newError) throw newError
        setProfile(newProfileData[0])
      } else {
        setProfile(profileData[0])
      }

      // دریافت تنظیمات کاربر
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError
      }

      // دریافت آخرین فعالیت‌ها
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (activitiesError) throw activitiesError

      setSettings(settingsData ? settingsData[0] : null)
      setActivities(activitiesData || [])
      
      // لاگ کردن فعالیت مشاهده داشبورد
      await logActivity('dashboard_view', 'مشاهده صفحه داشبورد')
      
    } catch (error) {
      console.error('❌ خطا در دریافت اطلاعات کاربر:', {
        message: error.message,
        code: error.code,
        details: error.details
      })
    } finally {
      setLoading(false)
    }
  }

  const logActivity = async (activityType, description) => {
    try {
      await supabase.rpc('log_user_activity', {
        user_uuid: user.id,
        activity_type: activityType,
        activity_description: description
      })
    } catch (error) {
      console.error('Error logging activity:', error)
    }
  }

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()

      if (error) throw error
      
      setProfile(data[0])
      await logActivity('profile_update', 'بروزرسانی اطلاعات پروفایل')
      
      return { success: true }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { success: false, error }
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">در حال بارگذاری اطلاعات کاربری...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* هدر داشبورد */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">داشبورد کاربری</h1>
              <p className="text-blue-100 mt-2">مدیریت حساب کاربری و فعالیت‌ها</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">👤</span>
            </div>
          </div>
        </div>

        {/* تب‌های ناوبری */}
        <div className="border-b border-slate-200 bg-slate-50/50">
          <nav className="flex -mb-px">
            {[
              { id: 'profile', name: 'پروفایل', icon: '👤' },
              { id: 'settings', name: 'تنظیمات', icon: '⚙️' },
              { id: 'activities', name: 'فعالیت‌ها', icon: '📊' },
              { id: 'security', name: 'امنیت', icon: '🔒' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 py-5 px-8 border-b-2 font-semibold text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* محتوای تب‌ها */}
        <div className="p-8">
          {activeTab === 'profile' && (
            <ProfileTab 
              profile={profile} 
              user={user} 
              onUpdate={updateProfile} 
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab 
              settings={settings} 
              user={user} 
            />
          )}

          {activeTab === 'activities' && (
            <ActivitiesTab activities={activities} />
          )}

          {activeTab === 'security' && (
            <SecurityTab user={user} />
          )}
        </div>
      </div>
    </div>
  )
}

// کامپوننت تب پروفایل
function ProfileTab({ profile, user, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    date_of_birth: profile?.date_of_birth || '',
    gender: profile?.gender || ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await onUpdate(formData)
    if (result.success) {
      setIsEditing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">اطلاعات پروفایل</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {isEditing ? 'انصراف' : 'ویرایش اطلاعات'}
        </button>
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard 
            label="ایمیل" 
            value={user.email} 
            icon="📧" 
            color="blue"
          />
          <InfoCard 
            label="نام کاربری" 
            value={profile?.username || 'تعیین نشده'} 
            icon="👤" 
            color="purple"
          />
          <InfoCard 
            label="نام کامل" 
            value={profile?.full_name || 'تعیین نشده'} 
            icon="🪪" 
            color="green"
          />
          <InfoCard 
            label="تلفن" 
            value={profile?.phone || 'تعیین نشده'} 
            icon="📞" 
            color="orange"
          />
          <InfoCard 
            label="وبسایت" 
            value={profile?.website || 'تعیین نشده'} 
            icon="🌐" 
            color="indigo"
          />
          <InfoCard 
            label="تاریخ تولد" 
            value={profile?.date_of_birth || 'تعیین نشده'} 
            icon="🎂" 
            color="pink"
          />
          <InfoCard 
            label="جنسیت" 
            value={profile?.gender || 'تعیین نشده'} 
            icon="⚧️" 
            color="teal"
          />
          <div className="md:col-span-2">
            <InfoCard 
              label="بیوگرافی" 
              value={profile?.bio || 'تعیین نشده'} 
              icon="📝" 
              color="gray"
            />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="نام کاربری"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="نام کاربری"
              icon="👤"
              color="purple"
            />
            <FormField
              label="نام کامل"
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              placeholder="نام کامل"
              icon="🪪"
              color="green"
            />
            <FormField
              label="تلفن"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="شماره تلفن"
              icon="📞"
              color="orange"
            />
            <FormField
              label="وبسایت"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
              placeholder="آدرس وبسایت"
              icon="🌐"
              color="indigo"
            />
            <FormField
              label="تاریخ تولد"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
              icon="🎂"
              color="pink"
            />
            <FormField
              label="جنسیت"
              type="select"
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              options={[
                { value: '', label: 'انتخاب کنید' },
                { value: 'male', label: 'مرد' },
                { value: 'female', label: 'زن' },
                { value: 'other', label: 'سایر' }
              ]}
              icon="⚧️"
              color="teal"
            />
          </div>
          <FormField
            label="بیوگرافی"
            type="textarea"
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            placeholder="درباره خودتان بنویسید..."
            icon="📝"
            color="gray"
            fullWidth
          />
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              ذخیره تغییرات
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-slate-500 hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              انصراف
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// کامپوننت تب تنظیمات
function SettingsTab({ settings, user }) {
  const [notificationSettings, setNotificationSettings] = useState({
    email: settings?.email_notifications ?? true,
    push: settings?.push_notifications ?? true,
    sms: false
  })

  const handleNotificationChange = (key, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">تنظیمات پیشرفته</h2>
          <p className="text-slate-600 mt-1">شخصی‌سازی تجربه کاربری</p>
        </div>
      </div>

      {/* تنظیمات اعلانات */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">🔔</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">تنظیمات اعلانات</h3>
            <p className="text-slate-600 text-sm">مدیریت نحوه دریافت اطلاعیه‌ها</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-900 mb-1">
                اعلانات ایمیلی
              </label>
              <p className="text-sm text-slate-600">دریافت اطلاعیه‌های مهم از طریق ایمیل</p>
            </div>
            <ToggleSwitch 
              enabled={notificationSettings.email}
              onChange={(val) => handleNotificationChange('email', val)}
            />
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-900 mb-1">
                اعلانات فوری
              </label>
              <p className="text-sm text-slate-600">نمایش نوتیفیکیشن در مرورگر</p>
            </div>
            <ToggleSwitch 
              enabled={notificationSettings.push}
              onChange={(val) => handleNotificationChange('push', val)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// کامپوننت تب فعالیت‌ها
function ActivitiesTab({ activities }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">گزارش فعالیت‌ها</h2>
          <p className="text-slate-600 mt-1">تاریخچه کامل اقدامات شما در سیستم</p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-slate-400">📝</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">هنوز فعالیتی ثبت نشده</h3>
          <p className="text-slate-600">پس از انجام اقدامات در سیستم، اینجا نمایش داده می‌شوند</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">📝</span>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-900">{activity.description}</h4>
                    <p className="text-slate-600 text-sm mt-1">{activity.activity_type}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-slate-500">
                        {new Date(activity.created_at).toLocaleString('fa-IR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// کامپوننت تب امنیت
function SecurityTab({ user }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">امنیت حساب</h2>
          <p className="text-slate-600 mt-1">مدیریت امنیت و دسترسی‌ها</p>
        </div>
      </div>

      {/* اطلاعات امنیتی */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">اطلاعات امنیتی</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard 
            label="آخرین ورود"
            value={new Date(user.last_sign_in_at).toLocaleString('fa-IR')}
            icon="🕒"
            color="emerald"
          />
          
          <InfoCard 
            label="تاریخ ایجاد حساب"
            value={new Date(user.created_at).toLocaleString('fa-IR')}
            icon="📅"
            color="purple"
          />
        </div>
      </div>
    </div>
  )
}

// کامپوننت‌های کمکی
function InfoCard({ label, value, icon, color }) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    purple: 'border-purple-200 bg-purple-50',
    green: 'border-green-200 bg-green-50',
    orange: 'border-orange-200 bg-orange-50',
    indigo: 'border-indigo-200 bg-indigo-50',
    pink: 'border-pink-200 bg-pink-50',
    teal: 'border-teal-200 bg-teal-50',
    gray: 'border-gray-200 bg-gray-50',
    emerald: 'border-emerald-200 bg-emerald-50'
  }

  const iconColors = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    indigo: 'text-indigo-600',
    pink: 'text-pink-600',
    teal: 'text-teal-600',
    gray: 'text-gray-600',
    emerald: 'text-emerald-600'
  }

  return (
    <div className={`border-2 rounded-xl p-4 ${colorClasses[color]} hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`text-lg ${iconColors[color]}`}>
          {icon}
        </div>
        <h3 className="font-medium text-gray-700 text-sm">{label}</h3>
      </div>
      <p className="text-gray-900 font-semibold text-right pr-2">{value}</p>
    </div>
  )
}

function FormField({ label, type, value, onChange, placeholder, icon, color, options, fullWidth }) {
  const colorClasses = {
    blue: 'border-blue-300 focus:ring-blue-500 focus:border-blue-500',
    purple: 'border-purple-300 focus:ring-purple-500 focus:border-purple-500',
    green: 'border-green-300 focus:ring-green-500 focus:border-green-500',
    orange: 'border-orange-300 focus:ring-orange-500 focus:border-orange-500',
    indigo: 'border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500',
    pink: 'border-pink-300 focus:ring-pink-500 focus:border-pink-500',
    teal: 'border-teal-300 focus:ring-teal-500 focus:border-teal-500',
    gray: 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
  }

  const iconColors = {
    blue: 'text-blue-500',
    purple: 'text-purple-500',
    green: 'text-green-500',
    orange: 'text-orange-500',
    indigo: 'text-indigo-500',
    pink: 'text-pink-500',
    teal: 'text-teal-500',
    gray: 'text-gray-500'
  }

  return (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        <span className={iconColors[color]}>{icon}</span>
        {label}
      </label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ${colorClasses[color]}`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          rows="3"
          placeholder={placeholder}
          className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ${colorClasses[color]}`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ${colorClasses[color]}`}
        />
      )}
    </div>
  )
}

function ToggleSwitch({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        enabled ? 'bg-blue-500' : 'bg-slate-300'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}