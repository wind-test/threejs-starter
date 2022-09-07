/*
 * @Descripttion: 选中的菜单的相关信息
 * @Author: huangjitao
 * @Date: 2021-08-04 21:35:38
 * @Function: 该文件用途描述
 */

import { useEffect } from "react"
import { useLocation } from "react-router"
import { useImmer } from "use-immer"
import { menu } from "../consts/menu"

interface StateProps {
  selectedKeys: string[];
  openKeys: string[];
  title: string
}

export const useSelectedMenu = () => {
  const [state, setState] = useImmer<StateProps>({
    selectedKeys: [],
    openKeys: [],
    title: ''
  })
  const {pathname} = useLocation()

  useEffect(() => {
    menu.forEach(item => {
      item.children.forEach(child => {
        if (child.path === pathname) {
          setState(state => {
            state.openKeys = [item.key]
            state.selectedKeys = [child.key]
            state.title = child.label
          })
        }
      })
    })
  }, [pathname])

  return {
    selectedKeys: state.selectedKeys,
    openKeys: state.openKeys,
    title: state.title
  }
}