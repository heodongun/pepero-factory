import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Heart, Gift, Gamepad2 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute top-0 left-[10%] w-2 h-20 bg-primary rounded-b-full chocolate-drip-viscous opacity-30"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="absolute top-0 left-[30%] w-2 h-24 bg-primary rounded-b-full chocolate-drip-viscous opacity-20"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="absolute top-0 left-[50%] w-2 h-16 bg-secondary rounded-b-full chocolate-drip-viscous opacity-25"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-0 left-[70%] w-2 h-20 bg-accent rounded-b-full chocolate-drip-viscous opacity-30"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute top-0 left-[90%] w-2 h-18 bg-primary rounded-b-full chocolate-drip-viscous opacity-20"
        style={{ animationDelay: "2s" }}
      />

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Pepero Factory 🍫</h1>
          <nav className="hidden md:flex gap-6">
            <Link href="/maker" className="text-lg hover:text-primary transition-colors">
              Make
            </Link>
            <Link href="/game" className="text-lg hover:text-secondary transition-colors">
              Game
            </Link>
            <Link href="/leaderboard" className="text-lg hover:text-primary transition-colors">
              Leaderboard
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">
              나만의 빼빼로를
              <br />
              <span className="text-primary">만들어보세요</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty leading-relaxed">
              초콜릿을 고르고, 토핑을 선택하고, 달콤한 메시지를 담아
              <br />
              특별한 사람에게 선물하세요 💕
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/maker">
                <Button size="lg" className="text-xl px-8 py-6 rounded-full hover:scale-105 transition-transform">
                  <Sparkles className="mr-2 h-6 w-6" />
                  빼빼로 만들기
                </Button>
              </Link>
              <Link href="/maker?random=true">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-xl px-8 py-6 rounded-full hover:scale-105 transition-transform"
                >
                  <Gift className="mr-2 h-6 w-6" />
                  랜덤 뽑기
                </Button>
              </Link>
            </div>

            {/* Floating Pepero Illustration */}
            <div className="relative h-64 mb-12">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 float">
                <div className="w-8 h-48 bg-primary rounded-t-sm rounded-b-md shadow-lg relative">
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-16 h-20 bg-secondary rounded-full opacity-80" />
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-12 h-16 bg-accent rounded-full opacity-60" />
                  <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/80 to-primary" />
                  {/* Toppings */}
                  <div className="absolute top-8 left-1 w-1.5 h-1.5 bg-card rounded-full" />
                  <div className="absolute top-12 right-1 w-1.5 h-1.5 bg-card rounded-full" />
                  <div className="absolute top-16 left-1.5 w-1.5 h-1.5 bg-card rounded-full" />
                </div>
              </div>

              {/* Sparkles */}
              <div className="absolute top-12 left-1/4 w-3 h-3 text-secondary sparkle" style={{ animationDelay: "0s" }}>
                ✨
              </div>
              <div className="absolute top-24 right-1/4 w-3 h-3 text-accent sparkle" style={{ animationDelay: "0.5s" }}>
                ✨
              </div>
              <div
                className="absolute bottom-12 left-1/3 w-3 h-3 text-primary sparkle"
                style={{ animationDelay: "1s" }}
              >
                💖
              </div>
              <div
                className="absolute bottom-20 right-1/3 w-3 h-3 text-secondary sparkle"
                style={{ animationDelay: "1.5s" }}
              >
                🍫
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">무엇을 할 수 있나요?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-xl transition-shadow bg-card/80 backdrop-blur">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-2">빼빼로 디자인</h4>
              <p className="text-muted-foreground leading-relaxed">초콜릿, 토핑, 포장지를 자유롭게 선택하세요</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow bg-card/80 backdrop-blur">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-secondary" />
              </div>
              <h4 className="text-xl font-bold mb-2">달콤한 운세</h4>
              <p className="text-muted-foreground leading-relaxed">오늘의 달콤지수와 귀여운 운세를 확인하세요</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow bg-card/80 backdrop-blur">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-xl font-bold mb-2">선물하기</h4>
              <p className="text-muted-foreground leading-relaxed">링크나 QR코드로 친구에게 보내세요</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow bg-card/80 backdrop-blur">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-2">미니 게임</h4>
              <p className="text-muted-foreground leading-relaxed">매칭 게임으로 특별한 토핑을 해금하세요</p>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">지금 바로 시작하세요!</h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              디지털 초콜릿 공장에서 당신만의 특별한 빼빼로를 만들어보세요
            </p>
            <Link href="/maker">
              <Button size="lg" className="text-xl px-10 py-6 rounded-full hover:scale-105 transition-transform">
                만들러 가기 →
              </Button>
            </Link>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-muted-foreground">
        <p className="text-lg">Made with 💖 for Pepero Day</p>
      </footer>
    </div>
  )
}
