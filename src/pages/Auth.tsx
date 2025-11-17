import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Repeat, Gift, ArrowLeftRight, Users, Sparkles, Mail, CheckCircle } from "lucide-react";

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    setLoading(true);
    try {
      await signIn(loginEmail, loginPassword);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword || !signupName) return;

    setLoading(true);
    try {
      await signUp(signupEmail, signupPassword, signupName);
      setRegisteredEmail(signupEmail);
      setEmailSent(true);
    } catch (error) {
      // Error is handled in useAuth
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <Card className="w-full max-w-md shadow-large border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-scale-in">
          <CardHeader className="space-y-1 text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full blur-lg opacity-40" />
                <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full shadow-lg">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Conta Criada com Sucesso!
            </CardTitle>
            <CardDescription className="text-base">
              Verifique seu email para ativar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Mail className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Link de verificação enviado!
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Enviamos um email para:
                  </p>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mt-1">
                    {registeredEmail}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                Abra seu email
              </p>
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                Clique no link de verificação
              </p>
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
                Volte aqui e faça login
              </p>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => setEmailSent(false)}
                variant="outline"
                className="w-full"
              >
                Voltar para Login
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Não recebeu o email? Verifique sua caixa de spam ou tente novamente.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-dark to-emerald-700 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full" />
          <div className="absolute top-40 right-32 w-24 h-24 border border-white rounded-full" />
          <div className="absolute bottom-32 left-40 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-28 h-28 border border-white rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Repeat className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">TrocaFácil</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            Transforme o que você não usa em algo que precisa
          </h1>
          <p className="text-white/80 text-lg mb-12">
            A plataforma colaborativa para trocar e doar itens de forma simples e segura.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-2.5 rounded-lg flex-shrink-0">
                <ArrowLeftRight className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Troque com segurança</h3>
                <p className="text-white/70 text-sm">Chat integrado para combinar todos os detalhes</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-2.5 rounded-lg flex-shrink-0">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Doe com propósito</h3>
                <p className="text-white/70 text-sm">Ajude quem precisa e desapegue do excesso</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-2.5 rounded-lg flex-shrink-0">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Comunidade ativa</h3>
                <p className="text-white/70 text-sm">Conecte-se com pessoas da sua região</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/60 text-sm">
            Economia circular &bull; Sustentabilidade &bull; Comunidade
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md shadow-large border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-scale-in">
          <CardHeader className="space-y-1 text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl blur-lg opacity-40" />
                <div className="relative bg-gradient-to-br from-primary to-primary-dark p-4 rounded-2xl shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold gradient-text">
              Bem-vindo ao TrocaFácil
            </CardTitle>
            <CardDescription className="text-base">
              Entre na sua conta ou crie uma nova
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Entrar
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Cadastrar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="animate-fade-in">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="h-11 bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm font-medium">
                      Senha
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="h-11 bg-white dark:bg-gray-800"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-md hover:shadow-lg transition-all text-base font-medium"
                    disabled={loading}
                  >
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="animate-fade-in">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-sm font-medium">
                      Nome completo
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Seu nome"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      className="h-11 bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="h-11 bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">
                      Senha
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-11 bg-white dark:bg-gray-800"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-md hover:shadow-lg transition-all text-base font-medium"
                    disabled={loading}
                  >
                    {loading ? "Criando conta..." : "Criar conta grátis"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
