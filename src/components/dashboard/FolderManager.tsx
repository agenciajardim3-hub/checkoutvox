import React, { useState, useMemo } from 'react';
import { FolderPlus, Trash2, Edit2, Check, X, Loader2, Folder } from 'lucide-react';
import { AppConfig } from '../../types';
import { Input } from '../ui/Input';

interface FolderManagerProps {
    checkouts: AppConfig[];
    onCreateFolder: (folderName: string) => void;
    onRenameFolder: (oldName: string, newName: string) => Promise<void>;
    onDeleteFolder: (folderName: string) => Promise<void>;
    isLoading?: boolean;
}

export const FolderManager: React.FC<FolderManagerProps> = ({
    checkouts,
    onCreateFolder,
    onRenameFolder,
    onDeleteFolder,
    isLoading = false
}) => {
    const [newFolderName, setNewFolderName] = useState('');
    const [editingFolder, setEditingFolder] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [deletingFolder, setDeletingFolder] = useState<string | null>(null);
    const [renamingFolder, setRenamingFolder] = useState<string | null>(null);

    // Get all unique folders with their product counts
    const folders = useMemo(() => {
        const folderMap = new Map<string, number>();

        checkouts.forEach(checkout => {
            const folder = checkout.folder || 'Sem Pasta';
            folderMap.set(folder, (folderMap.get(folder) || 0) + 1);
        });

        return Array.from(folderMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => {
                if (a.name === 'Sem Pasta') return 1;
                if (b.name === 'Sem Pasta') return -1;
                return a.name.localeCompare(b.name);
            });
    }, [checkouts]);

    const handleCreateFolder = () => {
        if (!newFolderName.trim()) return;
        if (folders.some(f => f.name === newFolderName.trim())) {
            alert('Pasta com esse nome já existe!');
            return;
        }
        onCreateFolder(newFolderName.trim());
        setNewFolderName('');
    };

    const handleStartRename = (folderName: string) => {
        if (folderName === 'Sem Pasta') {
            alert('Não é possível renomear a pasta padrão');
            return;
        }
        setEditingFolder(folderName);
        setEditingName(folderName);
    };

    const handleConfirmRename = async (oldName: string) => {
        if (!editingName.trim()) {
            setEditingFolder(null);
            return;
        }
        if (editingName === oldName) {
            setEditingFolder(null);
            return;
        }
        if (folders.some(f => f.name === editingName.trim() && f.name !== oldName)) {
            alert('Pasta com esse nome já existe!');
            return;
        }
        setRenamingFolder(oldName);
        try {
            await onRenameFolder(oldName, editingName.trim());
        } finally {
            setRenamingFolder(null);
            setEditingFolder(null);
        }
    };

    const handleDeleteFolder = async (folderName: string) => {
        if (folderName === 'Sem Pasta') {
            alert('Não é possível deletar a pasta padrão');
            return;
        }
        const folder = folders.find(f => f.name === folderName);
        if (folder && folder.count > 0) {
            alert(`Essa pasta contém ${folder.count} produto(s). Mova os produtos para outra pasta antes de deletá-la.`);
            return;
        }
        if (confirm(`Deletar a pasta "${folderName}"?`)) {
            setDeletingFolder(folderName);
            try {
                await onDeleteFolder(folderName);
            } finally {
                setDeletingFolder(null);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Gerenciador de Pastas</h2>
                <p className="text-gray-400 text-sm font-bold mt-1 uppercase tracking-widest">Organize seus produtos em categorias</p>
            </div>

            {/* Create New Folder */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-8 mb-12">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <Input
                            label="Nome da Nova Pasta"
                            type="text"
                            placeholder="Ex: Cursos, Webinars, Workshops"
                            value={newFolderName}
                            onChange={setNewFolderName}
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        onClick={handleCreateFolder}
                        disabled={isLoading || !newFolderName.trim()}
                        className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FolderPlus size={18} /> Criar Pasta
                    </button>
                </div>
            </div>

            {/* Folders List */}
            <div className="space-y-4">
                {folders.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-12 text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <Folder size={48} />
                        </div>
                        <h3 className="text-lg font-black text-gray-900">Nenhuma pasta criada</h3>
                        <p className="text-gray-400 font-bold mt-2">Crie sua primeira pasta para começar a organizar seus produtos.</p>
                    </div>
                ) : (
                    folders.map(folder => (
                        <div
                            key={folder.name}
                            className={`bg-white rounded-[2rem] border-2 transition-all ${
                                editingFolder === folder.name
                                    ? 'border-blue-300 shadow-lg shadow-blue-100'
                                    : 'border-gray-100 hover:border-gray-200 hover:shadow-lg'
                            }`}
                        >
                            <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex-1 flex items-center gap-4 w-full">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Folder className="text-blue-600" size={24} />
                                    </div>

                                    {editingFolder === folder.name ? (
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="text"
                                                value={editingName}
                                                onChange={e => setEditingName(e.target.value)}
                                                className="flex-1 px-4 py-2 rounded-xl border-2 border-blue-300 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-700"
                                                autoFocus
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex-1">
                                            <h3 className="text-lg font-black text-gray-900">{folder.name}</h3>
                                            <p className="text-sm text-gray-400 font-bold">
                                                {folder.count} produto{folder.count !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                {folder.name !== 'Sem Pasta' && (
                                    <div className="flex gap-2 w-full md:w-auto">
                                        {editingFolder === folder.name ? (
                                            <>
                                                <button
                                                    onClick={() => handleConfirmRename(folder.name)}
                                                    disabled={renamingFolder === folder.name}
                                                    className="flex-1 md:flex-none bg-emerald-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {renamingFolder === folder.name ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <Check size={16} />
                                                    )}
                                                    Salvar
                                                </button>
                                                <button
                                                    onClick={() => setEditingFolder(null)}
                                                    disabled={renamingFolder === folder.name}
                                                    className="flex-1 md:flex-none bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-black text-xs uppercase hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    <X size={16} /> Cancelar
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleStartRename(folder.name)}
                                                    disabled={isLoading}
                                                    className="flex-1 md:flex-none bg-blue-50 text-blue-600 px-6 py-3 rounded-xl font-black text-xs uppercase hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    <Edit2 size={16} /> Renomear
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteFolder(folder.name)}
                                                    disabled={isLoading || deletingFolder === folder.name}
                                                    className="flex-1 md:flex-none bg-red-50 text-red-600 px-6 py-3 rounded-xl font-black text-xs uppercase hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {deletingFolder === folder.name ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                    Deletar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Info Box */}
            {folders.length > 0 && (
                <div className="mt-12 bg-blue-50 rounded-[2rem] border border-blue-100 p-6 flex gap-4">
                    <div className="text-blue-600 flex-shrink-0 mt-1">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-black">!</div>
                    </div>
                    <div>
                        <h4 className="font-black text-blue-900 text-sm">Dica:</h4>
                        <p className="text-blue-700 text-xs font-bold mt-1">Ao renomear uma pasta, todos os produtos nela serão automaticamente atualizados. Para deletar uma pasta, certifique-se de que ela está vazia.</p>
                    </div>
                </div>
            )}
        </div>
    );
};
