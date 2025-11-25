import { Card, CardHeader, CardContent } from './ui/card';

export const HistoryPanel = ({ history, onSearch, onClose }) => {
  console.log('HistoryPanel received history:', history);
  
  if (!history || history.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <CardContent className="text-center py-8">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-gray-700 text-lg font-semibold">No search history yet</p>
          <p className="text-gray-500">Start searching for cities to build your history!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">📚 Your Search History</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <p className="text-gray-600 text-sm">
          {history.length} saved location{history.length !== 1 ? 's' : ''}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
          {history.map((item, index) => (
            <div 
              key={index}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border border-blue-100 hover:border-blue-200"
              onClick={() => onSearch(item.city)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{item.city}</h3>
                  <p className="text-gray-600 text-sm">
                    {Math.round(item.temperature)}°C • {item.condition}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {history.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-gray-500 text-sm">
              Click on any city to search for current weather
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};