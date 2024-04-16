import { Collapse, ConfigProvider, Flex } from 'antd'
import { useState } from 'react'

export interface ICollapsibleSectionProps {
  title?: string
  children: React.ReactNode
}

export const CollapsibleSection: React.FC<ICollapsibleSectionProps> = ({ title, children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false)

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Collapse: {
              contentBg: 'transparent',
            },
          },
        }}
      >
        <Collapse
          onChange={() => setCollapsed(!collapsed)}
          ghost
          defaultActiveKey={['1']}
          items={[
            {
              key: '1',
              label: (
                <Flex className="c-w-100" align="center">
                  <span className={`c-p-r-1 c-font-color-gray-6 c-font-size-2 c-font-uppercase" `}>
                    {title}
                  </span>
                  <div className={`divider-line c-bg-gray-6 c-w-100`} />
                </Flex>
              ),
              children: (
                <Flex gap={24} vertical>
                  {children}
                </Flex>
              ),
            },
          ]}
        />
      </ConfigProvider>

      <style jsx>{`
        .accordion-title {
          display: flex;
          align-items: center;
        }

        .divider-line {
          height: 2px;
        }

        .divider-line.collapsed {
          transition: 0.4s ease-out;
          height: 1px;
        }

        .accordion-content {
          transition: max-height 0.4s ease-out;
          overflow: hidden;
        }

        .accordion-content.collapsed {
          max-height: 0;
        }

        .accordion-content:not(.collapsed) {
          max-height: 2000px;
        }
      `}</style>
    </>
  )
}
