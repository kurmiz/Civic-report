import React from 'react';
import { Helmet } from 'react-helmet';

interface PageContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  title, 
  description = '', 
  children 
}) => {
  return (
    <>
      <Helmet>
        <title>{title} | CitizenReport</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </>
  );
};

export default PageContainer;
