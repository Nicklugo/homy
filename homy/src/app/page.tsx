import ProductComparison from './components/ProductComparison';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Product Recommendations</h1>
      <ProductComparison />
    </main>
  );
} 