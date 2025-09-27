import React, { useState } from 'react';
import { Layout, Menu, Input } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, VideoCameraOutlined, SearchOutlined } from '@ant-design/icons';
import { ROUTES } from '../../routes';

const { Header } = Layout;
const { Search } = Input;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Menu items
  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
      onClick: () => navigate(ROUTES.HOME)
    },
    {
      key: 'movies',
      icon: <VideoCameraOutlined />,
      label: 'Phim',
      onClick: () => navigate(ROUTES.MOVIES)
    }
  ];

  // Xác định current menu key dựa trên location
  const getCurrentKey = () => {
    if (location.pathname === ROUTES.HOME) return 'home';
    if (location.pathname.includes('/movies')) return 'movies';
    return 'home';
  };

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    if (value.trim()) {
      navigate(`${ROUTES.MOVIES}?search=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#001529',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}
    >
      {/* Logo */}
      <div
        style={{
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
          marginRight: '40px',
          cursor: 'pointer'
        }}
        onClick={() => navigate(ROUTES.HOME)}
      >
        🎬 MOVIX
      </div>

      {/* Menu */}
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[getCurrentKey()]}
        items={menuItems}
        style={{ 
          flex: 1, 
          minWidth: 0,
          background: 'transparent',
          borderBottom: 'none'
        }}
      />

      {/* Search */}
      <Search
        placeholder="Tìm kiếm phim..."
        allowClear
        enterButton={<SearchOutlined />}
        size="middle"
        style={{ width: 300 }}
        onSearch={handleSearch}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </Header>
  );
};

export default Navbar;