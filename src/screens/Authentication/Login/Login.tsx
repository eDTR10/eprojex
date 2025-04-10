import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

function Login() {
  const [showPassword, setShowPassword] = useState(false)

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    draggable: true,
    swipe: true,
    swipeToSlide: true,
    touchThreshold: 10,
    cssEase: "cubic-bezier(0.87, 0.03, 0.41, 0.9)",
    arrows: false, // Add this line to hide the arrows
    dotsClass: "slick-dots",
    appendDots: (dots: any) => (
      <div className=" text-secondary-foreground" style={{ bottom: "25px" }}>
        <ul className=" text-white " >{dots}</ul>
      </div>
    )
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="flex h-screen bg-background">
        {/* Carousel Section */}
        {/* Carousel Section */}
<div className="w-[70vw] lg:w-1/2 bg-card">
  <Slider {...carouselSettings} className="h-screen">
    <div className="!flex h-[80vh] items-center justify-center flex-col gap-4">
      <h2 className="text-3xl font-bold text-primary">Welcome to eProjex</h2>
      <p className="text-muted-foreground text-lg">Manage your projects efficiently</p>
    </div>
    <div className="!flex h-[80vh] items-center justify-center flex-col gap-4">
      <h2 className="text-3xl font-bold text-primary">Collaborate Seamlessly</h2>
      <p className="text-muted-foreground text-lg">Work together with your team</p>
    </div>
    <div className="!flex h-[80vh] items-center justify-center flex-col gap-4">
      <h2 className="text-3xl font-bold text-primary">Track Progress</h2>
      <p className="text-muted-foreground text-lg">Monitor your project's development</p>
    </div>
  </Slider>
</div>

        {/* Login Form Section */}
        <div className=" w-[30vw] border border-border lg:w-1/2 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">
            <div className=" fixed top-0 right-0 p-4">
                <ModeToggle  />
            </div>
            
            
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold text-primary">Welcome backeProjEx</h1>
              <p className="text-muted-foreground">Enter your credentials to login</p>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className=" text-secondary-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className=" text-secondary-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <p
               
                className="text-sm pt-1 hover:underline text-primary cursor-pointer"
              >
                Forgot password?
              </p>

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>

            <div className="text-center space-y-2">
             
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <a 
                  href="#" 
                  className="text-primary hover:underline"
                >
                  Create account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default Login