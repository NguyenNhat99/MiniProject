export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-10">
      <div className="container mx-auto text-center py-4 text-sm">
        © {new Date().getFullYear()} Nguyễn Hoàng Nhất
      </div>
    </footer>
  );
}
