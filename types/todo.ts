/** TODO 1件分のデータ型（テスト・実験用に独立ファイル化） */
export type Todo = {
  id: string;
  title: string;
  details: string;
  deadline: string;
  completed: boolean;
  tags: string[];
};
