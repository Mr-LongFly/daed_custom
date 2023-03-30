import { graphql } from '@daed/schemas/gql'
import { Attachment, Group } from '@mui/icons-material'
import {
  BottomNavigation,
  BottomNavigationAction,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { bindContextMenu, bindMenu, usePopupState } from 'material-ui-popup-state/hooks'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router'

import { QUERY_KEY_NODE } from '~/constants'
import { useQGLQueryClient } from '~/contexts'

export const NodeList = () => {
  const { t } = useTranslation()
  const gqlClient = useQGLQueryClient()

  const contextMenuState = usePopupState({
    variant: 'popover',
  })

  const nodesQuery = useQuery({
    queryKey: QUERY_KEY_NODE,
    queryFn: async () =>
      gqlClient.request(
        graphql(`
          query Nodes {
            nodes {
              edges {
                id
                name
              }
            }
          }
        `)
      ),
  })

  return (
    <Stack flex={1} {...bindContextMenu(contextMenuState)}>
      <List>
        {nodesQuery.data?.nodes.edges.map(({ id, name }) => (
          <ListItem key={id}>
            <ListItemButton>
              <ListItemText>{name}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}

        <Menu {...bindMenu(contextMenuState)}>
          <MenuItem
            onClick={() => {
              nodesQuery.refetch()
              contextMenuState.close()
            }}
          >
            {t('actions.refresh')}
          </MenuItem>
        </Menu>
      </List>
    </Stack>
  )
}

export const NodeGroup = () => {
  return <Stack />
}

export const Node = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Fragment>
      <Stack flex={1}>
        <Outlet />
      </Stack>

      <BottomNavigation
        showLabels
        value={location.pathname}
        onChange={(_, route) => {
          navigate(route)
        }}
      >
        <BottomNavigationAction value="/node" label={t('node')} icon={<Attachment />} />
        <BottomNavigationAction value="/node/group" label={t('group')} icon={<Group />} />
      </BottomNavigation>
    </Fragment>
  )
}