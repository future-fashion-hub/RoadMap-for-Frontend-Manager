export interface RoadmapItem {
  id: string;
  name: string;
  description: string;
  externalLink?: string;
  status: 'not-started' | 'in-progress' | 'completed';
  notes?: string;
  dueDate?: string; // Строка с датой в формате ISO
}

export interface Roadmap {
  name: string;
  description: string;
  items: RoadmapItem[];
}

export const loadRoadmap = async (file: File): Promise<Roadmap> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedData: Roadmap = JSON.parse(content);

        // Базовая валидация
        if (!parsedData.name || !parsedData.description || !Array.isArray(parsedData.items)) {
          throw new Error('Неверная структура JSON дорожной карты. Отсутствует имя, описание или массив элементов.');
        }

        // Инициализация статуса и заметок для элементов, если они отсутствуют
        const validatedItems: RoadmapItem[] = parsedData.items.map(item => ({
          ...item,
          status: item.status || 'not-started',
          notes: item.notes || '',
        }));

        resolve({ ...parsedData, items: validatedItems });
      } catch (error) {  // ← ИСПРАВЛЕНО: добавлена открывающая скобка
        console.error('Ошибка разбора файла дорожной карты:', error);
        reject(new Error('Не удалось разобрать файла дорожной карты. Убедитесь, что это действительный JSON.'));
      }
    };

    reader.onerror = (error) => {
      console.error('Ошибка чтения файла:', error);
      reject(new Error('Не удалось прочитать файл.'));
    };

    reader.readAsText(file);
  });
};

export const exportRoadmap = (roadmap: Roadmap, filename: string = 'roadmap.json') => {
  const jsonString = JSON.stringify(roadmap, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};