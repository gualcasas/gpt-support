export const ChatHeader = () => {
    return (
        <div className="w-full text-zinc-800">
            <div className="flex flex-col items-start text-sm">
                <p className="text-xs">Chat with</p>
                <div className="flex items-center gap-1.5">
                    <p className="h-2 w-2 rounded-full bg-green-500" />
                    <p>Bookbudy support</p>
                </div>
            </div>
        </div>
    );
};
