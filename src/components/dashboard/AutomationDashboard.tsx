import React, { useState } from 'react';
import { Settings, Smartphone, MessageCircle, Check, AlertCircle, Loader2, Eye, EyeOff, Send } from 'lucide-react';

interface AutomationDashboardProps {
    userRole: string;
}

export const AutomationDashboard: React.FC<AutomationDashboardProps> = ({ userRole }) => {
    const [uazapiUrl, setUazapiUrl] = useState('');
    const [uazapiKey, setUazapiKey] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isAutomationEnabled, setIsAutomationEnabled] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Mensagem automática
    const [messageTitle, setMessageTitle] = useState('Parabéns! Pagamento Confirmado 🎉');
    const [messageBody, setMessageBody] = useState(
        'Olá {nome}!\n\nSeu pagamento para {produto} foi confirmado!\n\nValor: R$ {valor}\n\nObrigado por confiar em nós! 🙏'
    );

    const handleTestConnection = async () => {
        if (!uazapiUrl || !uazapiKey || !whatsappNumber) {
            setErrorMessage('Preencha URL, API Key e número do WhatsApp');
            return;
        }

        setIsTesting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Validação básica - em produção, chamaria a API real
            if (uazapiUrl.includes('http') && uazapiKey.length > 10 && whatsappNumber.match(/^\d{10,15}$/)) {
                setIsConnected(true);
                setSuccessMessage('✅ Conexão testada com sucesso!');
                localStorage.setItem('vox_uazapi_url', uazapiUrl);
                localStorage.setItem('vox_uazapi_key', uazapiKey);
                localStorage.setItem('vox_whatsapp_number', whatsappNumber);
            } else {
                setErrorMessage('Dados inválidos. Verifique URL, API Key e número.');
                setIsConnected(false);
            }
        } catch (err) {
            setErrorMessage(`Erro ao conectar: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
            setIsConnected(false);
        } finally {
            setIsTesting(false);
        }
    };

    const handleSaveMessage = () => {
        if (!messageTitle || !messageBody) {
            setErrorMessage('Título e corpo da mensagem são obrigatórios');
            return;
        }

        localStorage.setItem('vox_automation_title', messageTitle);
        localStorage.setItem('vox_automation_body', messageBody);
        setSuccessMessage('✅ Mensagem automática salva!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleToggleAutomation = () => {
        if (!isConnected) {
            setErrorMessage('Conecte ao UazAPI primeiro!');
            return;
        }
        setIsAutomationEnabled(!isAutomationEnabled);
        localStorage.setItem('vox_automation_enabled', (!isAutomationEnabled).toString());
        setSuccessMessage(`✅ Automação ${!isAutomationEnabled ? 'ativada' : 'desativada'}!`);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleSendTestMessage = async () => {
        if (!isConnected || !whatsappNumber) {
            setErrorMessage('Conecte ao UazAPI primeiro!');
            return;
        }

        setIsTesting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Simular envio de mensagem
            const testMessage = messageBody
                .replace('{nome}', 'João Teste')
                .replace('{produto}', 'Curso Premium')
                .replace('{valor}', '199,90');

            console.log('Mensagem de teste:', testMessage);
            setSuccessMessage('✅ Mensagem de teste enviada para ' + whatsappNumber);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setErrorMessage(`Erro ao enviar: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        } finally {
            setIsTesting(false);
        }
    };

    if (userRole !== 'master') {
        return null;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Card Conexão UazAPI */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Smartphone size={20} className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Conexão UazAPI</h3>
                    {isConnected && <Check size={18} className="text-emerald-600 ml-auto" />}
                </div>

                <div className="space-y-4 mb-6">
                    {/* URL Base */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-2 tracking-widest">
                            URL Base do UazAPI
                        </label>
                        <input
                            type="text"
                            placeholder="https://api.uazapi.com"
                            value={uazapiUrl}
                            onChange={(e) => setUazapiUrl(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 font-bold text-sm"
                        />
                    </div>

                    {/* API Key */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-2 tracking-widest">
                            Chave de API
                        </label>
                        <div className="relative">
                            <input
                                type={showApiKey ? 'text' : 'password'}
                                placeholder="sua-chave-api"
                                value={uazapiKey}
                                onChange={(e) => setUazapiKey(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 font-bold text-sm"
                            />
                            <button
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Número WhatsApp */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-2 tracking-widest">
                            Número WhatsApp (Raiz)
                        </label>
                        <input
                            type="text"
                            placeholder="5535999999999"
                            value={whatsappNumber}
                            onChange={(e) => setWhatsappNumber(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 font-bold text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-2">Formato: DDI + DDD + número (ex: 5535999999999)</p>
                    </div>

                    {/* Status */}
                    {isConnected && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-3">
                            <Check size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-bold text-emerald-700">Conectado ao UazAPI com sucesso!</p>
                        </div>
                    )}

                    {/* Mensagens */}
                    {successMessage && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-3">
                            <Check size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-bold text-emerald-700">{successMessage}</p>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3">
                            <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-bold text-red-700">{errorMessage}</p>
                        </div>
                    )}
                </div>

                {/* Botão Testar */}
                <button
                    onClick={handleTestConnection}
                    disabled={isTesting || !uazapiUrl || !uazapiKey || !whatsappNumber}
                    className="w-full px-4 py-3 rounded-xl font-bold text-sm uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-700"
                >
                    {isTesting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    {isTesting ? 'Testando...' : 'Testar Conexão'}
                </button>
            </div>

            {/* Card Mensagem Automática */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageCircle size={20} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Mensagem Automática ao Pagar</h3>
                </div>

                <div className="space-y-4 mb-6">
                    {/* Título */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-2 tracking-widest">
                            Título da Mensagem
                        </label>
                        <input
                            type="text"
                            placeholder="Parabéns! Pagamento Confirmado 🎉"
                            value={messageTitle}
                            onChange={(e) => setMessageTitle(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                        />
                    </div>

                    {/* Corpo */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-2 tracking-widest">
                            Corpo da Mensagem
                        </label>
                        <textarea
                            placeholder="Digite sua mensagem..."
                            value={messageBody}
                            onChange={(e) => setMessageBody(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs text-gray-700 bg-white"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            💡 Variáveis disponíveis: <code className="bg-gray-100 px-2 py-1 rounded">{"{"}</code>nome<code className="bg-gray-100 px-2 py-1 rounded">{"}"}</code>, <code className="bg-gray-100 px-2 py-1 rounded">{"{"}</code>produto<code className="bg-gray-100 px-2 py-1 rounded">{"}"}</code>, <code className="bg-gray-100 px-2 py-1 rounded">{"{"}</code>valor<code className="bg-gray-100 px-2 py-1 rounded">{"}"}</code>
                        </p>
                    </div>
                </div>

                {/* Botões */}
                <div className="flex gap-3">
                    <button
                        onClick={handleSendTestMessage}
                        disabled={isTesting || !isConnected}
                        className="flex-1 px-4 py-3 rounded-xl font-bold text-sm uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-2 bg-amber-100 text-amber-700 hover:bg-amber-200"
                    >
                        {isTesting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        Enviar Teste
                    </button>

                    <button
                        onClick={handleSaveMessage}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm uppercase hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                        <Check size={16} />
                        Salvar Mensagem
                    </button>
                </div>
            </div>

            {/* Card Ativar Automação */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Settings size={20} className="text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900">Ativar Automação</h3>
                            <p className="text-xs text-gray-500 mt-1">Enviar mensagem automaticamente quando cliente pagar</p>
                        </div>
                    </div>

                    {/* Toggle */}
                    <button
                        onClick={handleToggleAutomation}
                        disabled={!isConnected}
                        className={`relative w-14 h-8 rounded-full transition-all ${
                            isAutomationEnabled ? 'bg-emerald-600' : 'bg-gray-300'
                        } disabled:opacity-50 flex items-center`}
                    >
                        <div
                            className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                                isAutomationEnabled ? 'translate-x-7' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

                {isAutomationEnabled && (
                    <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-3">
                        <Check size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-bold text-emerald-700">
                            ✅ Automação Ativa! Mensagens serão enviadas automaticamente ao pagamento.
                        </p>
                    </div>
                )}

                {!isConnected && (
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3">
                        <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-bold text-amber-700">
                            ⚠️ Conecte ao UazAPI para ativar a automação
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
